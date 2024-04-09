#!/bin/bash

arg=$(echo -en "$1" | iconv -t ASCII//IGNORE 2>/dev/null | sed 's/[^a-zA-Z0-9\_\-\=\&\/\:\.\?]//g');
#url=$(echo -en "https://lars.d.umn.edu/RTN/program.html?silent=true&$arg" | tr -d '\n');
#content=$(node ./../decompressor.js \"$url\"); 
# Use curl to fetch the webpage content
content=$(curl -s "$arg")

# Use grep with PCRE to extract the value at $2
# The regex pattern is enclosed in single quotes to prevent shell interpretation
# The -o option tells grep to only output the matched part of the line
# The -P option enables Perl-compatible regular expressions
title=$(echo -en "$content" | grep -oP '(?:og:title" content=")([^>\"]*)(?:">)' | awk -F'"' '{print $3}')
body=$(echo -en "$content" | grep -oP '(?:og:description" content=")([^>\"]*)' | awk -F'"' '{print $3}')

# Replace all non-alphanumeric characters in the title and body with underscores
title=$(echo -en "$title" | sed 's/[^a-zA-Z0-9]/_/g')
body=$(echo -en "$body" | sed 's/[^a-zA-Z0-9]/_/g')

# Check if both title and body are empty, and if so, print "event"
print=$(echo -en "$title,$body\n")
echo "$print" >> ./result2.csv
#if [[ -z "$title" && -z "$body" ]]; then
#    print=$(echo -en "$url\n")
#    echo "--->$print<---" >> ./result3.csv
#fi