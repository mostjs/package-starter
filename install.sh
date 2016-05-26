#!/bin/bash

printf "\e[92m[~] Name your project: \e[0m\n"

read name

name=${name// /-}

printf "\e[33m[~] Downloading awesomeness...\e[0m\n"

git clone https://github.com/mostjs/package-starter $name \
&& cd $name \
&& rm -rf ./.git \
&& git init \
&& sed -i -- "s/mostPackage/${name}/g" package.json \
&& npm install 

printf "\e[32m[✔] Successfully installed ${name}\e[32m!\n"
