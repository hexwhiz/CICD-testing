pipeline {
    agent any

    tools {
        nodejs 'node22'
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/hexwhiz/CICD-testing'
            }
        }

        stage('Install & Build') {
            steps {
                dir('testing') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy to Linux VM') {
            steps {
                dir('testing') {
                    bat '''
                    scp -r dist/* user@144.24.124.62:/var/www/cicd/
                    '''
                }
            }
        }
    }
}i
