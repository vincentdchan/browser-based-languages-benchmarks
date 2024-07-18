#include "zip.h"
#include "miniz.h"
#include <cstdlib>

extern "C" {

char * run(int level, const char *inbuf, size_t* out_size_ref) {
  size_t input_len = strlen(inbuf);
  char* outbuf;
  size_t buf_len = mz_compressBound(input_len);
  outbuf = (char*)malloc(buf_len);

  mz_compress2((unsigned char*)outbuf, &buf_len, (const unsigned char*)inbuf, input_len, level);
  *out_size_ref = buf_len;

  return outbuf;
}

}
