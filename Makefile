# Define a variable for all subdirectories containing a Makefile under the "games" directory
GAMES_SUBDIRS := $(shell find ./games -type f -name 'Makefile' -exec dirname {} \;)

.PHONY: all $(GAMES_SUBDIRS)

all: $(GAMES_SUBDIRS)

# For each subdirectory, run make
$(GAMES_SUBDIRS):
	$(MAKE) -C $@