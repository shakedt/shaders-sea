uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;  
uniform float uColorMultiplier;
varying float vElvation;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  
  float mixStrength = (vElvation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  // basic fog calculations
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );
  color = mix( color, fogColor, fogFactor );

  
  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}