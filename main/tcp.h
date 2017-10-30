/*
MIT License

Copyright (c) 2017 Marcel Kottmann

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

#if !defined(EL_TCP_H_INCLUDED)
#define EL_TCP_H_INCLUDED

int createNonBlockingSocket(int domain, int type, int protocol, bool nonblocking);
int connectNonBlocking(int sockfd, const char *hostname, int portno);
int bindAndListen(int sockfd, int portno);
int acceptIncoming(int sockfd);
int checkSockets(int *socketfds, int len_socketfds, fd_set *readset, fd_set *writeset, fd_set *errset);
int readSocket(int sockfd, char *msg, int len);
int writeSocket(int sockfd, const char *msg);
int* socket_stats(int *sockfds, int len_sockfds);
void closeSocket(int sockfd);

#endif