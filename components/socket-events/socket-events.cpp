/*
MIT License

Copyright (c) 2019 Marcel Kottmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#include "socket-events.h"

#include "openssl/ssl.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "esp_log.h"
#include "tcp.h"
#include "esp32-javascript.h"

static const char *tag = "esp32-javascript";

TaskHandle_t stask;
int notConnectedSockets_len = 0;
int *notConnectedSockets = NULL;
int connectedSockets_len = 0;
int *connectedSockets = NULL;
int connectedWritableSockets_len = 0;
int *connectedWritableSockets = NULL;
int selectClientSocket = -1;
int selectServerSocket = -1;
SemaphoreHandle_t xSemaphore;
bool needsUnblock = false;
struct sockaddr_in target;

extern const unsigned char cacert_pem_start[] asm("_binary_cacert_pem_start");
extern const unsigned char cacert_pem_end[] asm("_binary_cacert_pem_end");
const unsigned int cacert_pem_bytes = cacert_pem_end - cacert_pem_start;

extern const unsigned char prvtkey_pem_start[] asm("_binary_prvtkey_pem_start");
extern const unsigned char prvtkey_pem_end[] asm("_binary_prvtkey_pem_end");
const unsigned int prvtkey_pem_bytes = prvtkey_pem_end - prvtkey_pem_start;

int createSocketPair()
{
    struct sockaddr_in server;

    log(DEBUG, "Start creating socket paair\n");
    /*int bits = xEventGroupGetBits(wifi_event_group);
    int connected = CONNECTED_BIT & bits;
*/
    int connected = 1;
    if (connected)
    {
        int sd = createNonBlockingSocket(AF_INET, SOCK_DGRAM, 0, true);
        if (sd >= 0)
        {
            int port = 6789;
            memset((char *)&server, 0, sizeof(server));
            server.sin_family = AF_INET;
            server.sin_addr.s_addr = htonl(INADDR_ANY);
            server.sin_port = htons(port);
            server.sin_len = sizeof(server);

            log(DEBUG, "Trying to bind socket %d...\n", sd);

            if (bind(sd, (struct sockaddr *)&server, sizeof(server)) >= 0)
            {
                log(DEBUG, "Trying to create client socket...\n");

                int sc = createNonBlockingSocket(AF_INET, SOCK_DGRAM, 0, true);

                log(DEBUG, "Created socket pair: %d<-->%d\n", sd, sc);

                log(DEBUG, "Send test data...\n");

                memset((char *)&target, 0, sizeof(target));
                target.sin_family = AF_INET;
                target.sin_port = htons(port);
                target.sin_len = sizeof(target);
                inet_pton(AF_INET, "127.0.0.1", &(target.sin_addr));

                if (sendto(sc, "", 1, 0, (const sockaddr *)&target, sizeof(target)) < 0)
                {
                    log(ERROR, "Error sending test data to self-socket: %d\n", errno);
                }
                else
                {
                    log(DEBUG, "Trying to receive test data...\n");
                    char msg[2] = "A";
                    struct sockaddr_in remaddr;
                    socklen_t addrlen = sizeof(remaddr);

                    int result = 0;
                    while ((result = recvfrom(sd, msg, 1, 0, (struct sockaddr *)&remaddr, &addrlen)) < 0 && errno == EAGAIN)
                    {
                    }

                    while (result < 0)
                    {
                        log(ERROR, "Error receiving test data from self-socket: %d\n", errno);
                    }
                    log(DEBUG, "Finished reading.\n");

                    if (strcmp(msg, "") == 0)
                    {
                        log(INFO, "Self-Socket Test successful!\n");

                        selectClientSocket = sc;
                        selectServerSocket = sd;
                        log(DEBUG, "Successfully created socket pair: %d<-->%d\n", selectServerSocket, selectClientSocket);
                        return 0;
                    }
                    else
                    {
                        log(ERROR, "Self-socket test NOT successful: %s\n", msg);
                    }
                }
                close(sc);
            }
            else
            {
                log(ERROR, "Binding self-socket was unsuccessful: %d\n", errno);
            }

            close(sd);
        }
        else
        {
            log(ERROR, "Self-socket could not be created: %d", errno);
        }
    }
    else
    {
        log(DEBUG, "Skip until wifi connected: %d\n", errno);
    }

    log(DEBUG, "Could not create socket pair... no wifi?\n");
    return -1;
}

void select_task_it()
{

    // create socket pair
    if (selectServerSocket < 0)
    {
        createSocketPair();
    }

    if (selectServerSocket >= 0 && (notConnectedSockets_len + connectedSockets_len + connectedWritableSockets_len) > 0)
    {
        fd_set readset;
        fd_set writeset;
        fd_set errset;

        int sockfd_max = -1;
        FD_ZERO(&readset);
        FD_ZERO(&writeset);
        FD_ZERO(&errset);

        //register not connected sockets for write ready event
        for (int i = 0; i < notConnectedSockets_len; i++)
        {
            int sockfd = notConnectedSockets[i];
            FD_SET(sockfd, &writeset);
            FD_SET(sockfd, &errset);
            if (sockfd > sockfd_max)
            {
                sockfd_max = sockfd;
            }
        }

        //register connected sockets for read ready event
        for (int i = 0; i < connectedSockets_len; i++)
        {
            int sockfd = connectedSockets[i];
            FD_SET(sockfd, &readset);
            FD_SET(sockfd, &errset);
            if (sockfd > sockfd_max)
            {
                sockfd_max = sockfd;
            }
        }

        //register connected sockets which have an onWritable callback
        for (int i = 0; i < connectedWritableSockets_len; i++)
        {
            int sockfd = connectedWritableSockets[i];
            FD_SET(sockfd, &writeset);
            if (sockfd > sockfd_max)
            {
                sockfd_max = sockfd;
            }
        }

        //set self-socket flag
        //reset (read all data) from self socket
        int dataAvailable;
        if (lwip_ioctl(selectServerSocket, FIONREAD, &dataAvailable) < 0)
        {
            log(ERROR, "Error getting data available from self-socket: %d.", errno);
        }
        log(DEBUG, "DATA AVAILABLE %d.\n", dataAvailable);
        //read self-socket if flag is set
        if (dataAvailable > 0)
        {
            char msg[dataAvailable];
            struct sockaddr_in remaddr;
            socklen_t addrlen = sizeof(remaddr);
            if (recvfrom(selectServerSocket, msg, dataAvailable, 0, (struct sockaddr *)&remaddr, &addrlen) < 0)
            {
                log(ERROR, "READ self-socket FAILED: %d\n", errno);
            }
            else
            {
                log(DEBUG, "READ of self-socket.\n");
            }
        }

        FD_SET(selectServerSocket, &readset);
        if (selectServerSocket > sockfd_max)
        {
            sockfd_max = selectServerSocket;
        }
        // self socket end
        int ret = select(sockfd_max + 1, &readset, &writeset, &errset, NULL);
        needsUnblock = true;
        log(DEBUG, "Select return %d.\n", ret);
        if (ret >= 0)
        {
            if (ret > 0)
            {
                js_eventlist_t events;
                events.events_len = 0;

                for (int i = 0; i < notConnectedSockets_len; i++)
                {
                    int sockfd = notConnectedSockets[i];
                    if (FD_ISSET(sockfd, &errset))
                    {
                        js_event_t event;
                        el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_ERROR, (void *)sockfd);
                        el_add_event(&events, &event);
                    }
                    else if (FD_ISSET(sockfd, &writeset))
                    {
                        js_event_t event;
                        el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_WRITE, (void *)sockfd);
                        el_add_event(&events, &event);
                    }
                }
                for (int i = 0; i < connectedSockets_len; i++)
                {
                    int sockfd = connectedSockets[i];
                    if (FD_ISSET(sockfd, &errset))
                    {
                        js_event_t event;
                        el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_ERROR, (void *)sockfd);
                        el_add_event(&events, &event);
                    }
                    else if (FD_ISSET(sockfd, &readset))
                    {
                        js_event_t event;
                        el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_READ, (void *)sockfd);
                        el_add_event(&events, &event);
                    }
                    else if (FD_ISSET(sockfd, &writeset))
                    {
                        js_event_t event;
                        el_create_event(&event, EL_SOCKET_EVENT_TYPE, EL_SOCKET_STATUS_WRITE, (void *)sockfd);
                        el_add_event(&events, &event);
                    }
                }

                if (events.events_len > 0)
                {
                    log(DEBUG, "Fire all %d socket events!\n", events.events_len);
                    el_fire_events(&events);
                }
                else
                {
                    log(DEBUG, "No socket events to fire!\n");
                }
            }
        }
        else
        {
            log(ERROR, "select returns ERROR: %d\n", errno);
        }
    }
    //wait for next loop
    needsUnblock = true;
    log(DEBUG, "Select loop finished and now waits for next iteration.\n");
    xSemaphoreTake(xSemaphore, portMAX_DELAY);
    needsUnblock = false;
}

static duk_ret_t el_registerSocketEvents(duk_context *ctx)
{
    int c_len, nc_len, cw_len;
    int *c_sockfds;
    int *nc_sockfds;
    int *cw_sockfds;

    //not connected sockets
    if (duk_is_array(ctx, 0))
    {
        nc_len = duk_get_length(ctx, 0);
        nc_sockfds = (int *)calloc(nc_len, sizeof(int));
        for (int i = 0; i < nc_len; i++)
        {
            duk_get_prop_index(ctx, 0, i);
            nc_sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
    }
    else
    {
        //error
        return -1;
    }

    //connected sockets
    if (duk_is_array(ctx, 1))
    {
        c_len = duk_get_length(ctx, 1);
        c_sockfds = (int *)calloc(c_len, sizeof(int));
        for (int i = 0; i < c_len; i++)
        {
            duk_get_prop_index(ctx, 1, i);
            c_sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
    }
    else
    {
        //error
        return -1;
    }

    //connected and registered for writable events
    if (duk_is_array(ctx, 2))
    {
        cw_len = duk_get_length(ctx, 2);
        cw_sockfds = (int *)calloc(cw_len, sizeof(int));
        for (int i = 0; i < cw_len; i++)
        {
            duk_get_prop_index(ctx, 2, i);
            cw_sockfds[i] = duk_to_int(ctx, -1);
            duk_pop(ctx);
        }
    }
    else
    {
        //error
        return -1;
    }

    //check if there are changes between this and the previous call
    bool changes = c_len != connectedSockets_len ||
                   nc_len != notConnectedSockets_len ||
                   cw_len != connectedWritableSockets_len;

    //deep check
    if (!changes)
    {
        for (int i = 0; i < nc_len; i++)
        {
            if (notConnectedSockets[i] != nc_sockfds[i])
            {
                changes = true;
                break;
            }
        }
        if (!changes)
        {
            for (int i = 0; i < c_len; i++)
            {
                if (connectedSockets[i] != c_sockfds[i])
                {
                    changes = true;
                    break;
                }
            }
        }
        if (!changes)
        {
            for (int i = 0; i < cw_len; i++)
            {
                if (connectedWritableSockets[i] != cw_sockfds[i])
                {
                    changes = true;
                    break;
                }
            }
        }
    }

    if (changes)
    {
        //swap
        free(notConnectedSockets);
        notConnectedSockets_len = nc_len;
        notConnectedSockets = nc_sockfds;

        free(connectedSockets);
        connectedSockets_len = c_len;
        connectedSockets = c_sockfds;

        free(connectedWritableSockets);
        connectedWritableSockets_len = cw_len;
        connectedWritableSockets = cw_sockfds;
    }
    else
    {
        free(nc_sockfds);
        free(c_sockfds);
        free(cw_sockfds);
    }

    if (changes)
    {
        log(DEBUG, "Trying to trigger the next select iteration... ");
        if (selectClientSocket >= 0)
        {
            //interrupt select through self-socket
            log(DEBUG, "Sending . to self-socket.");
            needsUnblock = true;
            if (sendto(selectClientSocket, ".", 1, 0, (const sockaddr *)&target, sizeof(target)) < 0)
            {
                log(ERROR, "Self-socket sending was NOT successful: %d\n", errno);
            }
            else
            {
                log(DEBUG, "Self-socket sending was successful.\n");
            }
        }
    }

    //trigger next select loop
    if (needsUnblock)
    {
        xSemaphoreGive(xSemaphore);
    }

    return 0;
}

static duk_ret_t el_createNonBlockingSocket(duk_context *ctx)
{
    int sockfd = createNonBlockingSocket(AF_INET, SOCK_STREAM, IPPROTO_TCP, true);

    duk_push_int(ctx, sockfd);
    return 1;
}

static duk_ret_t el_connectNonBlocking(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    const char *hostname = duk_to_string(ctx, 1);
    int port = duk_to_int(ctx, 2);

    int ret = connectNonBlocking(sockfd, hostname, port);
    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_bindAndListen(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    int port = duk_to_int(ctx, 1);

    int ret = bindAndListen(sockfd, port);
    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_acceptIncoming(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);

    int ret = acceptIncoming(sockfd);
    if (ret < 0)
    {
        if (errno == EAGAIN)
        {
            log(INFO, "accept returned EAGAIN\n");
            //return undefined
            return 0;
        }
        else
        {
            log(ERROR, "accept returned errno:%d on socket %d\n", errno, sockfd);
        }
    }

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t shutdownSSL(duk_context *ctx)
{
    SSL *ssl = (SSL *)duk_to_int(ctx, 0);
    SSL_shutdown(ssl);
    return 0;
}

static duk_ret_t freeSSL(duk_context *ctx)
{
    SSL *ssl = (SSL *)duk_to_int(ctx, 0);
    SSL_free(ssl);
    return 0;
}

static duk_ret_t acceptSSL(duk_context *ctx)
{
    SSL *ssl = (SSL *)duk_to_int(ctx, 0);
    int sockfd = duk_to_int(ctx, 1);
    log(INFO, "SSL server accept client ......");
    SSL_set_fd(ssl, sockfd);
    int ret = SSL_accept(ssl);
    if (ret <= 0)
    {
        log(INFO, "SSL_accept failed; return value %d", ret);
    }
    else
    {
        log(INFO, "OK");
    }
    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t connectSSL(duk_context *ctx)
{
    int before = errno;
    SSL *ssl = (SSL *)duk_to_int(ctx, 0);
    int sockfd = duk_to_int(ctx, 1);
    log(INFO, "SSL server connect server ......");
    if (SSL_get_fd(ssl) < 0)
    {
        SSL_set_fd(ssl, sockfd);
    }
    int ret = SSL_connect(ssl);
    int error = 1; // means "no error"
    if (ret <= 0)
    {
        int err = SSL_get_error(ssl, ret);
        log(ERROR, "SSL_connect failed, return value was %d; SOCKET %d SSL error code %d and errno %d and before errno was %d", ret, sockfd, err, errno, before);
        error = -1; //means "error"
    }

    /*
    Verification fails always, because no trusted CAs are configured.
    Return value of verifyResult is incorrect. Turning on OpenSSL debug mode
    shows the correct internal return values from mbedtls. 
    int verifyResult = SSL_get_verify_result(ssl);
    if (verifyResult != X509_V_OK)
    {
        log(ERROR,"SSL Certificate is invalid: %d\n", verifyResult);
        error = -1; //means "error"
    }
*/

    if (error < 0)
    {
        SSL_shutdown(ssl);
    }

    duk_push_int(ctx, error);
    return 1;
}

static duk_ret_t el_closeSocket(duk_context *ctx)
{
    int socketfd = duk_to_int(ctx, 0);
    closeSocket(socketfd);
    return 0;
}

static duk_ret_t writeSocket_bind(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    const char *msg = NULL;
    int len = 0;
    int offset = 0;
    SSL *ssl = NULL;

    if (!duk_is_undefined(ctx, 3))
    {
        offset = duk_to_int(ctx, 3);
    }
    if (!duk_is_undefined(ctx, 4))
    {
        ssl = (SSL *)duk_to_int(ctx, 4);
    }

    if (duk_is_string(ctx, 1))
    {
        msg = duk_to_string(ctx, 1);
        if (duk_is_undefined(ctx, 2))
        {
            len = strlen(msg) - offset;
        }
        else
        {
            len = duk_to_int(ctx, 2);
        }
    }
    else
    {
        duk_size_t buffer_len;
        msg = (char *)duk_get_buffer_data(ctx, 1, &buffer_len);

        if (duk_is_undefined(ctx, 2))
        {
            len = buffer_len - offset;
        }
        else
        {
            len = duk_to_int(ctx, 2);

            if (len + offset > buffer_len)
            {
                return -1;
            }
        }
    }
    int ret = writeSocket(sockfd, msg + offset, len, ssl);

    duk_push_int(ctx, ret);
    return 1;
}

static duk_ret_t el_getsockopt(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);
    int val;
    unsigned int len = sizeof(int);
    if (getsockopt(sockfd, SOL_SOCKET, SO_ERROR, &val, &len) < 0)
    {
        return -1;
    }
    duk_push_int(ctx, val);
    return 1;
}

static duk_ret_t el_readSocket(duk_context *ctx)
{
    int sockfd = duk_to_int(ctx, 0);

    SSL *ssl = NULL;
    if (!duk_is_undefined(ctx, 1))
    {
        ssl = (SSL *)duk_to_int(ctx, 1);
    }

    int LEN = 3 * 1024;
    char msg[LEN];

    int ret = 0;
    int error = 0;

    if (ssl == NULL)
    {
        ret = readSocket(sockfd, msg, LEN - 1);
        error = errno;
    }
    else
    {
        ret = SSL_read(ssl, msg, LEN - 1);
        if (ret < 0)
        {
            error = SSL_get_error(ssl, ret);
        }
    }

    if (ret >= 0)
    {
        msg[ret] = '\0';
        duk_idx_t obj_idx = duk_push_object(ctx);
        duk_push_int(ctx, ret);
        duk_put_prop_string(ctx, obj_idx, "length");
        duk_push_string(ctx, msg);
        duk_put_prop_string(ctx, obj_idx, "data");
    }
    else if ((ssl == NULL && error == EAGAIN) || (ssl != NULL && error == SSL_ERROR_WANT_READ))
    {
        log(DEBUG, "*** EAGAIN OR SSL_ERROR_WANT_READ RETURNED!!!\n");

        //eagain
        duk_push_undefined(ctx);
    }
    else
    {
        log(ERROR, "READ ERROR return value %d and error code %d\n", ret, error);
        //error
        duk_push_null(ctx);
    }
    return 1;
}

void select_task(void *ignore)
{
    log(DEBUG, "Starting select task...\n");

    while (true)
    {
        log(DEBUG, "Starting next select loop.\n");
        select_task_it();
    }
}

SSL_CTX *createSSLServerContext()
{
    log(INFO, "SSL server context create ......");
    SSL_CTX *ctx = SSL_CTX_new(TLSv1_2_server_method());
    if (!ctx)
    {
        abort();
    }
    log(INFO, "OK");

    log(INFO, "SSL server context set own certification......");
    int ret = SSL_CTX_use_certificate_ASN1(ctx, cacert_pem_bytes, cacert_pem_start);
    if (!ret)
    {
        log(INFO, "failed");
        abort();
    }
    log(INFO, "OK");

    log(INFO, "SSL server context set private key......");
    ret = SSL_CTX_use_PrivateKey_ASN1(0, ctx, prvtkey_pem_start, prvtkey_pem_bytes);
    if (!ret)
    {
        log(INFO, "failed");
        abort();
    }
    log(INFO, "OK");
    return ctx;
}

SSL_CTX *createSSLClientContext()
{
    log(INFO, "SSL client context create ......");
    SSL_CTX *ctx = SSL_CTX_new(TLSv1_2_client_method());
    SSL_CTX_set_verify(ctx, SSL_VERIFY_PEER, NULL);
    if (!ctx)
    {
        abort();
    }
    log(INFO, "OK");
    return ctx;
}

SSL *createSSL(SSL_CTX *ctx)
{
    log(INFO, "Create new SSL connection......");
    SSL *ssl = SSL_new(ctx);
    if (!ssl)
    {
        log(INFO, "failed");
        abort();
    }
    log(INFO, "OK");
    return ssl;
}

static duk_ret_t el_createSSLServerContext(duk_context *ctx)
{
    duk_push_int(ctx, (duk_int_t)createSSLServerContext());
    return 1;
}

static duk_ret_t el_createSSLClientContext(duk_context *ctx)
{
    duk_push_int(ctx, (duk_int_t)createSSLClientContext());
    return 1;
}

static duk_ret_t el_createSSL(duk_context *ctx)
{
    SSL_CTX *sslCtx = (SSL_CTX *)duk_to_int(ctx, 0);

    SSL *ssl = createSSL(sslCtx);

    if (!duk_is_undefined(ctx, 1))
    {
        const char *hostname = duk_to_string(ctx, 1);
        SSL_set_tlsext_host_name(ssl, hostname);
    }

    duk_push_int(ctx, (duk_int_t)ssl);
    return 1;
}

void initSocketFunctions(duk_context *ctx)
{
    duk_push_c_function(ctx, writeSocket_bind, 5 /*nargs*/);
    duk_put_global_string(ctx, "writeSocket");

    duk_push_c_function(ctx, el_readSocket, 2 /*nargs*/);
    duk_put_global_string(ctx, "readSocket");

    duk_push_c_function(ctx, el_closeSocket, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_closeSocket");

    duk_push_c_function(ctx, el_createNonBlockingSocket, 0 /*nargs*/);
    duk_put_global_string(ctx, "el_createNonBlockingSocket");

    duk_push_c_function(ctx, el_connectNonBlocking, 3 /*nargs*/);
    duk_put_global_string(ctx, "el_connectNonBlocking");

    duk_push_c_function(ctx, el_bindAndListen, 2 /*nargs*/);
    duk_put_global_string(ctx, "el_bindAndListen");

    duk_push_c_function(ctx, el_acceptIncoming, 1 /*nargs*/);
    duk_put_global_string(ctx, "el_acceptIncoming");

    duk_push_c_function(ctx, el_registerSocketEvents, 3 /*nargs*/);
    duk_put_global_string(ctx, "el_registerSocketEvents");

    duk_push_c_function(ctx, el_createSSLServerContext, 0);
    duk_put_global_string(ctx, "createSSLServerContext");

    duk_push_c_function(ctx, el_createSSLClientContext, 0);
    duk_put_global_string(ctx, "createSSLClientContext");

    duk_push_c_function(ctx, el_createSSL, 2);
    duk_put_global_string(ctx, "createSSL");

    duk_push_c_function(ctx, acceptSSL, 2);
    duk_put_global_string(ctx, "acceptSSL");

    duk_push_c_function(ctx, connectSSL, 2);
    duk_put_global_string(ctx, "connectSSL");

    duk_push_c_function(ctx, shutdownSSL, 1);
    duk_put_global_string(ctx, "shutdownSSL");

    duk_push_c_function(ctx, freeSSL, 1);
    duk_put_global_string(ctx, "freeSSL");

    duk_push_c_function(ctx, el_getsockopt, 1);
    duk_put_global_string(ctx, "el_getsockopt");

    duk_push_int(ctx, EL_SOCKET_EVENT_TYPE);
    duk_put_global_string(ctx, "EL_SOCKET_EVENT_TYPE");

    xSemaphore = xSemaphoreCreateBinary();

    xTaskCreatePinnedToCore(&select_task, "select_task", 12 * 1024, NULL, 5, &stask, 1);
}