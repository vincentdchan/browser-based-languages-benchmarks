
#include "freetype/config/ftconfig.h"
#include "freetype/config/ftoption.h"
#include "freetype/freetype.h"
#include "stdio.h"
#include <cstdlib>

extern "C" {

int run(const char *inbuf, const char* font, size_t font_size) {
  // open font with free type
  FT_Error error = 0;
  FT_Library library;
  FT_Face face;
  error = FT_Init_FreeType(&library);
  if (error) {
    printf("Error initializing freetype: %d\n", error);
    return -1;
  }

  error = FT_New_Memory_Face(library, reinterpret_cast<const unsigned char*>(font), font_size, 0, &face);
  if (error) {
    printf("Error loading font: %d\n", error);
    return -1;
  }
  // error = FT_Set_Pixel_Sizes(face, 0, font_size);
  // if (error) {
  //   printf("Error setting font size: %d\n", error);
  //   return -1;
  // }

  int result = 0;

  // compute the x advance of each characterj
  size_t input_len = strlen(inbuf);
  for (size_t i = 0; i < input_len; i++) {
    error = FT_Load_Char(face, inbuf[i], FT_LOAD_NO_BITMAP);
    if (error) {
      printf("Error loading character: %d, index: %zu\n", error, i);
      return -1;
    }
    // load the x advance
    int x_advance = face->glyph->advance.x / 64;

    result += x_advance;
  }

  // cleanup fonts
  FT_Done_Face(face);
  FT_Done_FreeType(library);

  return result;
}

}
