/**
 * Peguei emprestado daqui: https://github.com/James-Smyth/three-grass-demo
 */

export const grassShader = {
  vert: `
    varying vec2 vUv;
    varying vec3 vColor;
    uniform float iTime;
    uniform vec3 playerPos;

    void main() {
      vUv = uv;
      vColor = color;
      vec3 cpos = position;

      float waveSize = 10.0;
      float tipDistance = 0.3;
      float centerDistance = 0.1;

      // Calcula distância até o jogador
      float distToPlayer = distance(vec2(position.x, position.z), playerPos.xy);
      float walkEffect = smoothstep(3.0, 0.0, distToPlayer); // Decai com distância

      // Anima a ponta da grama
      if (color.x > 0.6) {
        cpos.x += sin((iTime / 500.0) + (uv.x * waveSize)) * tipDistance;
        cpos.z += cos((iTime / 700.0) + (uv.y * waveSize)) * tipDistance;

        // Deita a grama quando pisada
        cpos.y *= (1.0 - walkEffect * 0.7);
      } else if (color.x > 0.0) {
        // Anima o meio da grama
        cpos.x += sin((iTime / 500.0) + (uv.x * waveSize)) * centerDistance;
        cpos.z += cos((iTime / 700.0) + (uv.y * waveSize)) * centerDistance;

        // Deita a grama quando pisada
        cpos.y *= (1.0 - walkEffect * 0.5);
      }

      vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
      gl_Position = mvPosition;
    }
  `,

  frag: `
    varying vec2 vUv;
    varying vec3 vColor;

    void main() {
      // Cor base verde com variação baseada na altura
      vec3 grassColor = mix(vec3(0.2, 0.5, 0.2), vec3(0.3, 0.7, 0.3), vColor.x);

      // Sombreamento baseado na altura
      float shadow = mix(0.6, 1.0, vColor.x);
      grassColor *= shadow;

      gl_FragColor = vec4(grassColor, 1.0);
    }
  `,
};
