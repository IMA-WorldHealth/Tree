#!/usr/bin/env groovy
pipeline {
  agent any
  tools {nodejs "latest"}
  stages {
    stage('preflight') {
      steps {
        echo sh(returnStdout: true, script: 'env')
        sh 'node -v'
      }
    }
    stage('build') {
      steps {
        sh 'yarn --version'
        sh 'git log --reverse -1'
        sh 'yarn --ignore-engines'
      }
    }
    stage('test') {
      steps {
        sh 'yarn test'
      }
    }
  }
}
