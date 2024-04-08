#!/bin/bash

arg=$(echo -en "$1" | sed 's/[^a-zA-Z0-9\-\_=&]/_/g');
url="https://lars.d.umn.edu/RTN/program.html?$arg";

# Use curl to fetch the webpage content
content=$(curl -s "$url")

# Use grep with PCRE to extract the value at $2
# The regex pattern is enclosed in single quotes to prevent shell interpretation
# The -o option tells grep to only output the matched part of the line
# The -P option enables Perl-compatible regular expressions
title=$(echo -en "$content" | grep -oP '(?:og:title" content=")([^>\"]*)(?:">)' | awk -F'"' '{print $3}')
body=$(echo -en "$content" | grep -oP '(?:og:description" content=")([^>\"]*)' | awk -F'"' '{print $3}')

# Replace all non-alphanumeric characters in the title and body with underscores
title=$(echo -en "$title" | sed 's/[^a-zA-Z0-9]/_/g')
body=$(echo -en "$body" | sed 's/[^a-zA-Z0-9]/_/g')

#param=$(echo "$url" | cut -d'?' -f2)

echo "$title,$body" >> ./result.csv