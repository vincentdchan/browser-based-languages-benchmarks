#include "zip.h"
#include <cstdlib>

extern "C" {

char * compress(const char *inbuf) {
  char *outbuf = NULL;
  size_t outbufsize = 0;

  struct zip_t *zip = zip_stream_open(NULL, 0, ZIP_DEFAULT_COMPRESSION_LEVEL, 'w');
  {
      zip_entry_open(zip, "foo-1.txt");
      {
          zip_entry_write(zip, inbuf, strlen(inbuf));
      }
      zip_entry_close(zip);

      /* copy compressed stream into outbuf */
      zip_stream_copy(zip, (void **)&outbuf, &outbufsize);
  }
  zip_stream_close(zip);

  return outbuf;
}

}
