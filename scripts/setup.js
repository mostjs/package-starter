import prompt from 'prompt'
import {exec} from 'child_process'
import {writeFile} from 'fs'

const json = require('../package.json')

const onErr = err => console.error(err)

function logCmd (error, stdin, stdout) {
  if (error !== null) {
    onErr(error)
  }
  console.log(stdin)
  console.log(stdout)
}

process.stdin.resume()
process.stdin.setEncoding('utf-8')

console.log('\n\n\nPlease follow the prompts to setup your new package\n')

prompt.start()

const properties = {
  packageName: {
    name: 'packageName',
    description: 'Enter your package\'s name (@most/)'
  },
  description: {
    name: 'description',
    description: 'Describe your awesome new package'
  },
  fullName: {
    name: 'fullName',
    description: 'What is your full name?'
  },
  githubUserName: {
    name: 'githubUserName',
    description: 'What is your Github username?'
  },
  email: {
    name: 'email',
    description: 'What is your email?'
  }
}

let githubUrl

function handleResults ({packageName, description, fullName, githubUserName, email}) {
  githubUrl = `https://github.com/${githubUserName}/${packageName}`
  writeFile('package.json',
`{
  "name": "@most/${packageName}",
  "version": "0.0.0",
  "description": "${description}",
  "main": "dist/${packageName}.js",
  "files": [
    "dist/${packageName}.js"
  ],
  "scripts": {
    "build-dist": "mkdir -p dist && rollup src/index.js | babel --presets es2015 --plugins transform-es2015-modules-umd --module-id '@most/${packageName}' -o dist/${packageName}.js",
    "build": "npm run build-dist && uglifyjs dist/${packageName}.js -o dist/${packageName}.min.js",
    "prepublish": "npm run build",
    "preversion": "npm run build",
    "unit-test": "babel-node ./node_modules/.bin/isparta cover _mocha",
    "lint": "jsinspect src && jsinspect test && eslint src test",
    "test": "npm run lint && npm run unit-test",
    "start": "npm install && npm prune"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${githubUserName}/${packageName}.git"
  },
  "author": "${fullName} <${email}> (github.com/${githubUserName})",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${githubUserName}/${packageName}/issues"
  },
  "homepage": "https://github.com/${githubUserName}/${packageName}#readme",
  "peerDependencies": ${JSON.stringify(json['peerDependencies'])},
  "devDependencies": ${JSON.stringify(json['devDependencies'])}
}
`)

  writeFile('README.md',
`# @most/${packageName}

${description}

## API

#### ${packageName} ::
`)
}

prompt.get({properties}, (err, results) => {
  if (err) { return onErr(err) }
  handleResults(results)
  const work = new Promise(resolve => {
    exec(`git remote add origin ${githubUrl}`, logCmd)
    exec('git add .', logCmd)
    exec('git commit -m "feat(): initial upload :fire:"')
    exec('git tag -f v0.0.0')
    setTimeout(resolve, 4000)
  })

  Promise.resolve(work)
    .then(() => {
      console.log('git origin set to ' + githubUrl)
      console.log('Set forth and create awesomeness!')
    })
})
