package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

type RandomDropProxy struct {
	proxy *httputil.ReverseProxy
}

func (p *RandomDropProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// 10% chance to drop the request
	if rand.Float32() < 0.1 {
		log.Println("Randomly dropping request")
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	}

	// Forward the request normally
	p.proxy.ServeHTTP(w, r)
}

func main() {
	// Seed the random number generator
	rand.Seed(time.Now().UnixNano())

	// Target URL to proxy requests to
	targetURL, err := url.Parse("http://localhost:8080")
	if err != nil {
		log.Fatal("Failed to parse target URL:", err)
	}

	// Create reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Create random drop proxy
	randomDropProxy := &RandomDropProxy{
		proxy: proxy,
	}

	// Start the proxy server
	listenAddr := ":8090"
	fmt.Printf("Proxy server starting on %s\n", listenAddr)
	fmt.Printf("Proxying to %s\n", targetURL)
	fmt.Println("10% chance of dropping requests with 503 Service Unavailable")

	log.Fatal(http.ListenAndServe(listenAddr, randomDropProxy))
}
