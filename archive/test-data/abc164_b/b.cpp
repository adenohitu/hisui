#include <iostream> // cout, endl, cin
#include <string> // string, to_string, stoi
#include <vector> // vector
#include <algorithm> // min, max, swap, sort, reverse, lower_bound, upper_bound
#include <utility> // pair, make_pair
#include <tuple> // tuple, make_tuple
#include <cstdint> // int64_t, int*_t
#include <cstdio> // printf
#include <map> // map
#include <queue> // queue, priority_queue
#include <set> // set
#include <stack> // stack
#include <deque> // deque
#include <unordered_map> // unordered_map
#include <unordered_set> // unordered_set
#include <bitset> // bitset
#include <cctype> // isupper, islower, isdigit, toupper, tolower

using namespace std;

int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    while (true) {
        c -= b;
        // cout << c << endl;
        if (c <= 0) {
            cout << "Yes" << endl;
            return 0;
        }
        a -= d;
        // cout << a << endl;
        if (a <= 0) {
            cout << "No" << endl;
            return 0;
        }
    }
}
