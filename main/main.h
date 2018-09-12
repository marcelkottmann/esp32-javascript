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

#if !defined(EL_MAIN_H_INCLUDED)
#define EL_MAIN_H_INCLUDED

typedef struct
{
    int type;
    int status;
    int fd;
} timer_event_t;

typedef struct
{
    timer_event_t events[4];
    int events_len;
} eventlist_t;

void IRAM_ATTR el_add_event(eventlist_t *events, timer_event_t *event);

void IRAM_ATTR el_fire_events(eventlist_t *events);

void IRAM_ATTR el_create_event(timer_event_t *event, int type, int status, int fd);


#endif