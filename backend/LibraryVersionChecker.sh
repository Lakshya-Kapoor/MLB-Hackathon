# Prompt the user for input
read -p "Please enter the library name: " user_input

# Check if the user provided an input
if [[ -z "$user_input" ]]; then
  echo -e "\e[31mNo library name provided. Exiting.\e[0m"  # Red color for error message
  exit 1
fi

# Check if the library is available
library_version=$(pip freeze | grep "^$user_input==")

if [[ -z "$library_version" ]]; then
  echo -e "\e[31mLibrary '$user_input' is not downloaded.\e[0m"  # Red color for not found message
else
  echo -e "\e[32mLibrary '$user_input' is available: $library_version\e[0m"  # Green color for success message
fi