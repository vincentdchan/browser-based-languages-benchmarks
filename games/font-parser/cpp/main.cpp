
#include "freetype/freetype.h"
#include <cstdlib>

extern "C" {

int run(const char *inbuf, const char* font, size_t font_size) {
  // open font with free type
  FT_Library library;
  FT_Face face;
  FT_Init_FreeType(&library);
  FT_New_Face(library, font, 0, &face);
  FT_Set_Pixel_Sizes(face, 0, font_size);
  FT_Error error = 0;
  int result = 0;


  // compute the x advance of each characterj
  size_t input_len = strlen(inbuf);
  for (size_t i = 0; i < input_len; i++) {
    error = FT_Load_Char(face, inbuf[i], FT_LOAD_RENDER);
    if (error) {
      return -1;
    }
    // load the x advance
    int x_advance = face->glyph->advance.x >> 6;

    result += x_advance;
  }

  // cleanup fonts
  FT_Done_Face(face);
  FT_Done_FreeType(library);

  return result;
}

}
