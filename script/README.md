# Usage

## Embedding the tour-listener-script into your project

To embed the `tour-listener-script` into your project, follow the steps below:

1. Include the following script and CSS link in your HTML file. Make sure to place these lines in the end body tag.

```html
  <script type="module" src="/src/main.tsx"></script>
  <link rel="stylesheet" href="./tour-style.css" /></link>
```

2. After that, you must initialize the tour connection by using `initTourConnection` function attached to global window object. This function must be inputted the `id` of the root element where your Application is mounted.
   Example:

```html
<script>
  window.initTourConnection("app");
</script>
```

That's it! You have successfully embedded the tour-listener-script into your project.

## Result:

https://drive.google.com/file/d/1vckWUPs6bBecmpcwfpDr_gQlsBZkwxiq/view?usp=sharing
