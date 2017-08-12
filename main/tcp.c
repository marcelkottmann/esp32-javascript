/* 
 * tcpclient.c - A simple TCP client
 * usage: tcpclient <host> <port>
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

#define BUFSIZE 1024
#define LISTEN_BACKLOG 50

int createNonBlockingSocket()
{
    int sockfd;
    u32_t opt;
    int ret;

    /* socket: create the socket */
    sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (sockfd < 0)
    {
        printf("ERROR opening socket");
        return -1;
    }

    //set non blocking (for connect)
    opt = lwip_fcntl(sockfd, F_GETFL, 0);
    opt |= O_NONBLOCK;
    ret = lwip_fcntl(sockfd, F_SETFL, opt);
    if (ret < 0)
    {
        printf("Cannot set non-blocking opt.");
        return -1;
    }
    return sockfd;
}

int connectNonBlocking(int sockfd, const char *hostname, int portno)
{
    int ret, n;
    struct sockaddr_in serveraddr;
    struct hostent *server;

    /* gethostbyname: get the server's DNS entry */
    server = gethostbyname(hostname);
    if (server == NULL)
    {
        printf("ERROR, no such host as %s\n", hostname);
        return -1;
    }

    /* build the server's Internet address */
    bzero((char *)&serveraddr, sizeof(serveraddr));
    serveraddr.sin_family = AF_INET;
    bcopy((char *)server->h_addr,
          (char *)&serveraddr.sin_addr.s_addr, server->h_length);
    serveraddr.sin_port = htons(portno);

    /* connect: create a connection with the server */
    ret = connect(sockfd, &serveraddr, sizeof(serveraddr));
    if (ret == 0)
    {
        printf("WARNING: NON BLOCKING SOCKET WAS CONNECTED IMMEDIATELY - BLOCKED?");
    }
    else if (ret == -1 && errno != EINPROGRESS)
    {
        printf("ERROR connecting");
        return -1;
    }
    return 0;
}

int acceptIncoming(int sockfd)
{
    int cfd = accept(sockfd, NULL, NULL);
    if (cfd < 0)
    {
        printf("ERROR while accepting\n");
        return cfd;
    }
    return cfd;
}

int bindAndListen(int sockfd, int portno)
{
    int ret;
    struct sockaddr_in serveraddr;

    /* build the server's Internet address */
    bzero((char *)&serveraddr, sizeof(serveraddr));
    serveraddr.sin_family = AF_INET;
    serveraddr.sin_port = htons(portno);

    /* connect: create a connection with the server */

    ret = bind(sockfd, (struct sockaddr *)&serveraddr,
               sizeof(serveraddr));
    if (ret == -1)
    {
        printf("ERROR binding");
        return -1;
    }

    if (listen(sockfd, LISTEN_BACKLOG) == -1)
    {
        printf("ERROR listening");
        return -1;
    }
    return 0;
}

int checkSockets(int *socketfds, int len_socketfds, fd_set *readset, fd_set *writeset, fd_set *errset)
{
    struct timeval tv;

    int sockfd_max = -1;
    for (int i = 0; i < len_socketfds; i++)
    {
        int sockfd = socketfds[i];
        FD_ZERO(readset);
        FD_SET(sockfd, readset);
        FD_ZERO(writeset);
        FD_SET(sockfd, writeset);
        FD_ZERO(errset);
        FD_SET(sockfd, errset);
        if (sockfd > sockfd_max)
        {
            sockfd_max = sockfd;
        }
    }

    tv.tv_sec = 0;
    tv.tv_usec = 0;
    return select(sockfd_max + 1, readset, writeset, errset, &tv);
}

int *socket_stats(int *sockfds, int len_sockfds)
{
    fd_set readset;
    fd_set writeset;
    fd_set errset;
    struct timeval tv;

    int sockfd_max = -1;
    FD_ZERO(&readset);
    FD_ZERO(&writeset);
    FD_ZERO(&errset);

    for (int i = 0; i < len_sockfds; i++)
    {
        int sockfd = sockfds[i];
        FD_SET(sockfd, &readset);
        FD_SET(sockfd, &writeset);
        FD_SET(sockfd, &errset);
        if (sockfd > sockfd_max)
        {
            sockfd_max = sockfd;
        }
    }

    tv.tv_sec = 0;
    tv.tv_usec = 0;
    int ret = select(sockfd_max + 1, &readset, &writeset, &errset, &tv);
    if (ret >= 0)
    {
        int *result = (int *)calloc(len_sockfds, sizeof(int));
        if (ret > 0)
        {
            for (int i = 0; i < len_sockfds; i++)
            {
                int sockfd = sockfds[i];
                int val = FD_ISSET(sockfd, &readset) ? 1 << 0 : 0;
                val |= FD_ISSET(sockfd, &writeset) ? 1 << 1 : 0;
                val |= FD_ISSET(sockfd, &errset) ? 1 << 2 : 0;
                result[i] = val;
            }
        }
        return result;
    }
    else
    {
        return NULL;
    }
}

int writeSocket(int sockfd, const char *msg)
{
    /* send the message line to the server */
    int n = write(sockfd, msg, strlen(msg));
    if (n < 0)
    {
        printf("ERROR writing to socket");
        return n;
    }
    return n;
}

int readSocket(int sockfd, const char *msg, int len)
{
    int n = read(sockfd, msg, len);
    if (n < 0)
    {
        printf("ERROR reading from socket");
        return -1;
    }
    return n;
}

void closeSocket(int sockfd)
{
    close(sockfd);
}
