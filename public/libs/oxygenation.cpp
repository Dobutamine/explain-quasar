extern "C" {
  int getDoubleNum(int n) {
    return 2 * n;
  }
}

int main() {
  return 42;
}



// emcc public/lib/oxygenation.cpp -s WASM=1 -s EXPORTED_FUNCTIONS="['_main']" -o public/wasm/oxygenation.js
