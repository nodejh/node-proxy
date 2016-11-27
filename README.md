## 用 Node.js 实现的代理程序



设置终端代理

```
export http_proxy=ip:port
```

测试


```
ab -n 1000 -c 10 http://localhost:9000/
```