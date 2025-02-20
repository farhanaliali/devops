# NGINX Ingress Installation and Configuration

## Prerequisites
- A running **Kubernetes cluster**
- **kubectl** configured to access the cluster
- **Helm** installed

---

## 1. Install NGINX Ingress Controller

### **Using YAML**
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml
```

### **Verify Installation**
```sh
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```
Look for the `ingress-nginx-controller` service and note its **external IP**.

---

## 2. Deploy a Sample Application

### **Create a Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
  labels:
    app: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - name: demo-app
        image: nginx
        ports:
        - containerPort: 80
```
Apply the deployment:
```sh
kubectl apply -f deployment.yaml
```

### **Create a Service**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-app-service
spec:
  selector:
    app: demo-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```
Apply the service:
```sh
kubectl apply -f service.yaml
```

---

## 3. Configure Ingress Resource

### **Create an Ingress Resource**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: demo-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: demo-k8s.cloudns.ph
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: demo-app-service
            port:
              number: 80
```
Apply the ingress:
```sh
kubectl apply -f ingress.yaml
```

---

## 4. Test the Application

### **Update `/etc/hosts` (Local Testing Only)**
Find the external IP of the NGINX Ingress Controller:
```sh
kubectl get svc -n ingress-nginx
```
Edit `/etc/hosts` on your local machine and add:
```sh
<EXTERNAL_IP> demo-k8s.cloudns.ph
```

Now, test the application:
```sh
curl http://demo-k8s.cloudns.ph
```
You should see the default NGINX welcome page.

---


## Step 5: Configure HTTPS and TLS Secret

Generate a self-signed certificate:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=demo-k8s.cloudns.ph/O=myapp"
```

Create a Kubernetes TLS secret:

```bash
kubectl create secret tls my-app-tls --cert=tls.crt --key=tls.key
```

Modify the Ingress resource to use TLS:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - demo-k8s.cloudns.ph
    secretName: my-app-tls
  rules:
  - host: demo-k8s.cloudns.ph
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app
            port:
              number: 80
```

Apply the updated ingress resource:

```bash
kubectl apply -f my-app-ingress.yaml
```

Your **NGINX Ingress** is now set up with **HTTPS and TLS support**! 🚀



