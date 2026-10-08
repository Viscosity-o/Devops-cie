Apipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Viscosity-o/Devops-cie.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t student-task-manager:latest .'
            }
        }

        stage('Docker Verify') {
            steps {
                sh 'docker images | grep student-task-manager'
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
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }
}

