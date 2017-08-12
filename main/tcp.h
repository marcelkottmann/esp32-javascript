#if !defined(EL_TCP_H_INCLUDED)
#define EL_TCP_H_INCLUDED

int createNonBlockingSocket();
int connectNonBlocking(int sockfd, const char *hostname, int portno);
int bindAndListen(int sockfd, int portno);
int acceptIncoming(int sockfd);
int checkSockets(int *socketfds, int len_socketfds, fd_set *readset, fd_set *writeset, fd_set *errset);
int readSocket(int sockfd, const char *msg, int len);
int writeSocket(int sockfd, const char *msg);
int* socket_stats(int *sockfds, int len_sockfds);
void closeSocket(int sockfd);

#endif