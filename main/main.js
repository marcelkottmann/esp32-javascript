function main() {
    setTimeout(function () {
        print('helo after 5000ms')
    }, 5000);
    data = 2;
    setTimeout(function () {
        print('helo after 2000s')
    }, 2000);
    setTimeout(function () {
        print('helo after 500ms')
    }, 500);
}