cmake_minimum_required(VERSION 3.17)
project(benchmarks)

set(CMAKE_CXX_STANDARD 17)

include_directories(../../../third_party/zip/src)
add_subdirectory(../../../third_party/zip ./zip)
link_libraries(zip)

add_executable(run
  main.cpp
)

if (${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
    set_target_properties(run PROPERTIES LINK_FLAGS
            "-s ALLOW_MEMORY_GROWTH=1 \
            -s INITIAL_MEMORY=67108864 \
            -s DISABLE_EXCEPTION_CATCHING=1 \
            -s EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\", \"allocateUTF8\", \"UTF8ToString\"]' \
             -s ENVIRONMENT='web,worker' \
            ")
endif()

set(CMAKE_C_FLAGS_DEBUG "-g3 -O1 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_CXX_FLAGS_DEBUG "-g3 -O1 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_C_FLAGS_RELEASE "-g0 -O3 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_CXX_FLAGS_RELEASE "-g0 -O3 -Werror -Wall -Wno-unused-but-set-variable")
