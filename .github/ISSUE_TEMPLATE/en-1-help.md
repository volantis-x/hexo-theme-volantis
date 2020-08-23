---
name: 'Help: Problems encountered in use (errors, inconsistent styles and examples, etc.)'
about: This template is suitable for solving problems encountered when using themes to build blogs.
title: ''
labels: 'help'
assignees: ''

---

<!-- If you delete this template, we may close your issue without conducting an investigation. -->

## Self-inspection Report

<!-- If you did not follow the steps in the template for self-inspection, we may not read your Issue. -->
<!-- 90% of the problems can be solved through self-check. -->

<!-- Change [] to [x] to select. -->

### Step 1: Read document <!-- 60% of the problems are solved in this step. -->

- [ ] Searched for keywords in the [Volantis](https://volantis.js.org) document, but did not find relevant content.
- [ ] Searched for keywords in [Hexo](https://hexo.io/zh-cn/docs/) official documents, but did not find relevant content.

### Step 2: Run the demo code <!-- 30% of the problems are solved by this step. -->

Open the terminal and execute the following command:

```bash
git clone https://github.com/volantis-x/demo.git && cd demo && npm i && hexo s
```

Does the result work normally? The test result is: A or B

- [ ] A. It can run normally, it means there is no problem with the theme and current environment configuration.
- [ ] B. It does not work normally, it means there is a problem with the theme or environment configuration. It is recommended to attach environment configuration information in the corresponding position below.

## Describe your problem

<!-- Describe your problem in as much detail as possible -->


## Environmental information <!-- Please provide the following information -->

### URL
<!-- If there is an abnormality in the local operation using the source code of the official website of the document, you do not need to provide a the URL. -->

- [ ] There is an exception in the local operation of the official source code of the document.
- [ ] There is no exception in the local operation of the official source code of the document. Please give the duplicate address and source code repository address _________________


### Screenshots
<!-- Different systems and browsers may have different effects. Provide screenshots to help find problems. -->
<details><summary>Screenshots</summary>

<!-- Paste screenshot here -->

</details>

### Browser & OS

<!-- Browser & OS -->

### Configuration file <!-- Come back and complete when you ask for it, if you want to solve the problem quickly, you can write it directly -->
<details><summary>Configuration Files</summary>

#### Site Config

Paste here the modified part in `blog/_config.yml`

```yml


```

#### Theme Config

Paste here the modified part in `themes/volantis/_config.yml`

```yml


```

#### node.js & npm

Paste the output by `node -v && npm -v`

```


```

#### package.json

Paste the output by `npm ls --depth 0` here

```


```

</details>
