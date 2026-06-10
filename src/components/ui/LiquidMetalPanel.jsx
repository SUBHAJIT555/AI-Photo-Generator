import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import LightRays from "@/component/LightRays";
import {
  createLiquidMetalUniforms,
  ensureLiquidMetalStyles,
} from "./liquidMetalTheme";
import "./LiquidMetal.css";

export function LiquidMetalPanel({
  className,
  children,
  withLightRays = false,
  lightRaysProps = {},
}) {
  const shaderRef = useRef(null);
  const shaderMount = useRef(null);

  useEffect(() => {
    if (withLightRays) return undefined;

    ensureLiquidMetalStyles();

    const loadShader = () => {
      try {
        if (!shaderRef.current) return;

        if (shaderMount.current?.destroy) {
          shaderMount.current.destroy();
        }

        shaderMount.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          createLiquidMetalUniforms(0),
          undefined,
          0.35
        );
      } catch (error) {
        console.error("Failed to load liquid metal panel shader:", error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [withLightRays]);

  return (
    <div className={cn("liquid-metal-panel-wrap", className)}>
      <div
        className={cn(
          "liquid-metal-panel",
          withLightRays && "liquid-metal-panel--rays"
        )}
      >
        <div className="liquid-metal-panel__shader-layer">
          {withLightRays ? (
            <>
              <div className="liquid-metal-panel__base" aria-hidden="true" />
              <LightRays
                className="liquid-metal-panel__rays"
                raysOrigin="top-center"
                raysColor="#ffffff"
                raysSpeed={1}
                lightSpread={0.45}
                rayLength={3.5}
                followMouse
                mouseInfluence={0.1}
                noiseAmount={0}
                distortion={0}
                pulsating={false}
                fadeDistance={1.2}
                saturation={1}
                {...lightRaysProps}
              />
            </>
          ) : (
            <div
              ref={shaderRef}
              className="shader-container-liquid-metal liquid-metal-panel__shader"
            />
          )}
        </div>
        {!withLightRays && (
          <div className="liquid-metal-panel__inner" aria-hidden="true" />
        )}
        <div className="liquid-metal-panel__content">{children}</div>
      </div>
    </div>
  );
}

LiquidMetalPanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  withLightRays: PropTypes.bool,
  lightRaysProps: PropTypes.object,
};
