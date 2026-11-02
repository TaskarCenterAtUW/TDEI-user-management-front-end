import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { mount } from './union-configurator.js';

const UnionConfigurator = forwardRef(function UnionConfigurator(
    { initialConfig, readOnly = false, onChange },
    ref
) {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!containerRef.current) return;
        const ui = mount(containerRef.current, {
            initialConfig,
            readOnly,
            onChange: (config, valid) => {
                if (onChangeRef.current) {
                    onChangeRef.current(config, valid);
                }
            }
        });
        instanceRef.current = ui;

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (initialConfig && instanceRef.current) {
            instanceRef.current.setConfig(initialConfig);
        }
    }, [initialConfig]);

    useEffect(() => {
        if (instanceRef.current) {
            instanceRef.current.setReadOnly(!!readOnly);
        }
    }, [readOnly]);

    useImperativeHandle(ref, () => ({
        getConfig: () => instanceRef.current?.getConfig(),
        setConfig: (cfg) => instanceRef.current?.setConfig(cfg),
        setReadOnly: (ro) => instanceRef.current?.setReadOnly(ro),
    }), []);

    return (
        <div
            ref={containerRef}
            className="union-configurator-wrapper"
            onClickCapture={(e) => {
                if (e.target.closest("button")) {
                    e.preventDefault();
                }
            }}
        />
    );
});

export default UnionConfigurator;
