import prompt from 'prompt'
import {exec} from 'child_process'
import {writeFile} from 'fs'
import pkgJson from 'pkg-json'

const onErr = err => console.error(err)

function logCmd (error) {
  if (error !== null) {
    onErr(error)
  }
}

exec('rimraf ./.git', logCmd)

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

const set = (field, value) => pkgJson({set: field, value})

function handleResults ({packageName, description, fullName, githubUserName, email}) {
  set('name', `@most/${packageName}`)
  set('main', `dist/${packageName}.js`)
  set('files', [`dist/${packageName}.js`])
  set('scripts.build-dist', `mkdir -p dist && rollup src/index.js | babel --presets es2015 --plugins transform-es2015-modules-umd --module-id '@most/${packageName}' -o dist/${packageName}.js`)
  set('scripts.build', `npm run build-dist && uglifyjs dist/${packageName}.js -o dist/${packageName}.min.js`)
  const githubUrl = `https://github.com/${githubUserName}/${packageName}`
  set('repository.url', `git+${githubUrl}.git`)
  set('author', `${fullName} <${email}> (github.com/${githubUserName})`)
  set('bugs.url', `${githubUrl}/issues`)
  set('homepage', `${githubUrl}#readme`)
  set('description', description)

  writeFile('README.md',
`# @most/${packageName}

${description}

## API

#### ${packageName} ::
`)

  exec('git init', logCmd)
  exec(`git remote add origin ${githubUrl}`, logCmd)
  exec('git add .', logCmd)
  exec('git commit -m "feat(): initial upload :fire:"')
  exec('git tag -f v0.0.0')

  console.log('git origin set to ' + githubUrl)
  console.log('Set forth and create awesomeness!')
}

prompt.get({properties}, (err, results) => {
  if (err) { return onErr(err) }
  handleResults(results)
})
