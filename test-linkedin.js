// Simple test to validate LinkedIn URL parsing
const url = "https://www.linkedin.com/in/johndoe";
const username = url.split('/in/')[1]?.split('/')[0];
console.log("LinkedIn URL:", url);
console.log("Extracted username:", username);

// Test URL validation
function validateLinkedInUrl(url) {
  return url.includes('linkedin.com/in/') || url.includes('linkedin.com/pub/');
}

console.log("URL is valid:", validateLinkedInUrl(url));
