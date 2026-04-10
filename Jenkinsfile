pipeline {
    agent any

    stages {

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
                	 withCredentials([sshUserPrivateKey(credentialsId: 'oracle-vm-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                        
                        // %SSH_USER% will automatically be replaced with 'ubuntu'
                        // %SSH_KEY% points to the temporary private key file
                        bat """
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no -r dist/* %SSH_USER%@144.24.124.62:/var/www/cicd/
                        """
                        
                    } 
		}
            }
        }
    }
}
