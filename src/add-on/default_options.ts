const filepath_default = '~/';
const filename_extension_default = '.org';
const filename_template_default = '{{ title | slugify: "latin" | replace: "-" , "_" }}';
const frontmatter_template_default = `#+title: {{ title }}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`;
const highlight_template_default = `* {{ highlight_text | replace: '\\n' : ' ' | truncate: 200 , "" | split: " " | pop | join: " " }}
  - {{ highlight_text | replace: '\\n' , ' '  }}{% if highlight_note %}
  - Note: {{ highlight_note | replace: '\\n' , ' ' }}{% endif %}`

export const option_defaults = {
  filepath: filepath_default,
  filename_extension: filename_extension_default,
  filename_template: filename_template_default,
  frontmatter_template: frontmatter_template_default,
  highlight_template: highlight_template_default,
};

