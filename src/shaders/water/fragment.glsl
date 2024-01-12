uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;  
uniform float uColorMultiplier;
varying float vElvation;

void main() {
  
  float mixStrength = (vElvation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}