
all: run.cpp
	mkdir -p out
	emcc run.cpp -O3 -s INITIAL_MEMORY=128MB -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT='web,worker' \
	 -I/opt/homebrew/include -std=c++17 \
	 -sEXPORTED_FUNCTIONS=_run -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -s EXPORT_ES6=1 -sMODULARIZE -o out/run.js
