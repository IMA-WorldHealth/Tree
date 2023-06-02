#!/usr/bin/env groovy

pipeline {
  agent any

  tools {
    nodejs "latest"
  }

  stages {
    stage('Preflight') {
      steps {
        script {
          echo "Running on ${env.NODE_NAME}"
          sh 'node -v'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'yarn --version'
        sh 'git rev-parse --short HEAD'
        sh 'yarn install --frozen-lockfile --ignore-engines'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn test'
      }
    }
  }

  post {
    always {
      deleteDir() // Clean up workspace
    }
  }
}
