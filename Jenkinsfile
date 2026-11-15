
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Viscosity-o/Devops-cie.git'
            }
        }

        stage('Check Environment') {
            steps {
                sh 'whoami'
                sh 'docker --version'
                sh 'minikube status'
                sh 'kubectl config current-context'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t my-image:latest .'
            }
        }

        stage('Docker Verify') {
            steps {
                sh 'docker images | grep my-image'
            }
        }

        stage('Load Image into Minikube') {
            steps {
                sh 'minikube image load my-image:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
                sh 'kubectl apply -f service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl rollout status deployment/task-manager-deployment'
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }
}
