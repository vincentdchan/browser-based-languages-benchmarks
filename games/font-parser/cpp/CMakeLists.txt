cmake_minimum_required(VERSION 3.17)
project(benchmarks)

set(CMAKE_CXX_STANDARD 17)

include_directories(../../../third_party/freetype/include)
add_subdirectory(../../../third_party/freetype ./freetype)
link_libraries(freetype)
add_compile_definitions(-DHAVE_FCNTL_H)

add_executable(run
  main.cpp
)

target_compile_definitions(run PUBLIC
        -DHAVE_FCNTL_H
        -DHAVE_UNISTD_H
        )

# include free type in build dir
target_include_directories(run PUBLIC
        ${CMAKE_CURRENT_BINARY_DIR}/freetype/include
        )

if (${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
    set_target_properties(run PROPERTIES LINK_FLAGS
            "-s ALLOW_MEMORY_GROWTH=1 \
            -s INITIAL_MEMORY=67108864 \
            -s DISABLE_EXCEPTION_CATCHING=1 \
            -s EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\", \"getValue\", \"allocateUTF8\", \"UTF8ToString\"]' \
            -s EXPORTED_FUNCTIONS='[\"_run\", \"_malloc\", \"_free\"]' \
            -s EXPORT_ES6=1 -sMODULARIZE \
             -s ENVIRONMENT='web,worker' \
            ")
endif()

set(CMAKE_C_FLAGS_DEBUG "-g3 -O1 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_CXX_FLAGS_DEBUG "-g3 -O1 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_C_FLAGS_RELEASE "-g0 -O3 -Werror -Wall -Wno-unused-but-set-variable")
set(CMAKE_CXX_FLAGS_RELEASE "-g0 -O3 -Werror -Wall -Wno-unused-but-set-variable")
