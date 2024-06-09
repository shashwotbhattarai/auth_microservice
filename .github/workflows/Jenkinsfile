pipeline {
    agent any
    environment {
        NODE_VERSION = '20'
        SONAR_TOKEN = credentials('sonar-token')
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_PASSWORD = credentials('docker-password')
        SONAR_HOST_URL = 'http://localhost:9000' // Replace with your actual SonarQube URL
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Lint Check') {
            agent {
                docker {
                    image 'node:20'
                    label 'docker'
                }
            }
            steps {
                script {
                    // Setup Node.js
                    sh 'npm install'
                    // Run ESLint
                    sh 'npm run lint'
                }
            }
        }
        stage('Build Check') {
            agent {
                docker {
                    image 'node:20'
                    label 'docker'
                }
            }
            steps {
                script {
                    // Install dependencies
                    sh 'npm install'
                    // Build project
                    sh 'npm run build'
                }
            }
        }
        stage('Test Check') {
            agent {
                docker {
                    image 'node:20'
                    label 'docker'
                }
            }
            steps {
                script {
                    // Install dependencies
                    sh 'npm install'
                    // Run unit tests
                    sh 'npm test'
                }
            }
        }
        stage('SonarQube Analysis') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:latest'
                    label 'docker'
                }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        // Run SonarQube analysis
                        sh """
                            sonar-scanner \
                            -Dsonar.projectKey=auth_microservice \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_TOKEN
                        """
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
        stage('Build and Push Docker Image') {
            agent {
                docker {
                    image 'docker:latest'
                    args '--privileged'
                }
            }
            steps {
                script {
                    // Log in to Docker Hub
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    // Build and Push Docker image
                    sh """
                        docker build -t shashwotbhattarai/auth_microservice_j .
                        docker push shashwotbhattarai/auth_microservice_j
                    """
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
