const filepath_default = '~/';
const filename_default = '{{ title | slugify: "latin" | replace: "-" , "_" }}.org';
const frontmatter_default = `#+title: {{ title }}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`;
const highlight_default = `* {{ highlight_text | replace: '\\n' : ' ' | truncate: 200 , "" | split: " " | pop | join: " " }}
  - {{ highlight_text | replace: '\\n' , ' '  }}{% if highlight_note != "" %}
  - Note: {{ highlight_note | replace: '\\n' , ' ' }}{% endif %}`

export const option_defaults = {
  filepath: filepath_default,
  filename: filename_default,
  frontmatter: frontmatter_default,
  highlight: highlight_default,
};

