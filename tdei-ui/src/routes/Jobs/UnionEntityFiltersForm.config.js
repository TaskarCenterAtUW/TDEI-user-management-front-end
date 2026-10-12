export const UNION_ENTITY_CONFIG = {
    edge: {
        supportsBuffer: true,
        supportsOverlap: true,
        presets: [
            { name: 'Crossing', tags: { footway: 'crossing', highway: 'footway' } },
            { name: 'Sidewalk', tags: { footway: 'sidewalk', highway: 'footway' } },
            { name: 'Traffic Island', tags: { footway: 'traffic_island', highway: 'footway' } },
            { name: 'Alley', tags: { highway: 'service', service: 'alley' } },
            { name: 'Driveway', tags: { highway: 'service', service: 'driveway' } },
            { name: 'Parking Aisle', tags: { highway: 'service', service: 'parking_aisle' } },
            { name: 'Footway', tags: { highway: 'footway' } },
            { name: 'Steps', tags: { highway: 'steps' } },
            { name: 'Pedestrian', tags: { highway: 'pedestrian' } },
            { name: 'Primary Street', tags: { highway: 'primary' } },
            { name: 'Secondary Street', tags: { highway: 'secondary' } },
            { name: 'Tertiary Street', tags: { highway: 'tertiary' } },
            { name: 'Residential Street', tags: { highway: 'residential' } },
            { name: 'Service Road', tags: { highway: 'service' } },
            { name: 'Trunk Road', tags: { highway: 'trunk' } },
            { name: 'Unclassified Road', tags: { highway: 'unclassified' } },
            { name: 'Living Street', tags: { highway: 'living_street' } },
        ],
        copy: {
            filterLabel: 'Edge types that may merge',
            filterHelp: 'Only ticked types can be dropped as duplicates. An edge is eligible if it matches any ticked type. Unticked types are always kept, even when they repeat a base edge.',
            bufferHelp: 'How far a second-dataset edge may sit from a base edge and still count as a duplicate. Leave blank to use the proximity value. Widening it never makes more nodes join.',
            overlapPlaceholder: '80 (default)',
            overlapHelp: "Share of the edge's length that must lie within the buffer. Leave blank for 80%. Only edges running parallel to a base edge are compared; edges that meet a base edge at an angle are not treated as duplicates.",
        },
    },
    node: {
        presets: [
            { name: 'Curb Ramp', tags: { barrier: 'kerb', kerb: 'lowered' } },
            { name: 'Flush Curb', tags: { barrier: 'kerb', kerb: 'flush' } },
            { name: 'Raised Curb', tags: { barrier: 'kerb', kerb: 'raised' } },
            { name: 'Rolled Curb', tags: { barrier: 'kerb', kerb: 'rolled' } },
            { name: 'Generic Curb', tags: { barrier: 'kerb' } },
        ],
        copy: {
            filterLabel: 'Node types whose attributes may merge',
            filterHelp: 'Attributes merge only when both nodes match a ticked type. Other second-dataset values are still recorded in ext:union_audit_* tags, so nothing is lost.',
        },
    },
    point: {
        presets: [
            { name: 'Fire Hydrant', tags: { emergency: 'fire_hydrant' } },
            { name: 'Power Pole', tags: { power: 'pole' } },
            { name: 'Bench', tags: { amenity: 'bench' } },
            { name: 'Waste Basket', tags: { amenity: 'waste_basket' } },
            { name: 'Manhole', tags: { man_made: 'manhole' } },
            { name: 'Bollard', tags: { barrier: 'bollard' } },
            { name: 'Street Lamp', tags: { highway: 'street_lamp' } },
            { name: 'Tree', tags: { natural: 'tree' } },
        ],
        copy: {
            filterLabel: 'Point types that may merge',
            filterHelp: 'Only ticked point types can merge. Other points are kept or added unchanged.',
        },
    },
    line: {
        supportsBuffer: true,
        supportsOverlap: true,
        presets: [
            { name: 'Fence', tags: { barrier: 'fence' } },
            { name: 'Tree Row', tags: { natural: 'tree_row' } },
        ],
        copy: {
            filterLabel: 'Line types that may merge',
            filterHelp: 'Only ticked line types can merge, and only with base lines of a ticked type. Others are kept or added unchanged.',
            bufferHelp: 'How far a second-dataset line may sit from a base line and still count as the same line. Leave blank to use the proximity value.',
            overlapPlaceholder: '70 (default)',
            overlapHelp: "Share of the line's length that must lie within the buffer. Leave blank for 70%.",
        },
    },
    polygon: {
        supportsOverlap: true,
        presets: null,
        copy: {
            filterLabel: 'Polygons that may merge',
            filterHelp: 'Each row is its own condition; a polygon matching any row may merge. Blank rows are not sent.',
            overlapPlaceholder: '70 (default)',
            overlapHelp: "Share of the base polygon's area the two must share to count as the same polygon. Leave blank for 70%.",
        },
    },
    zone: {
        supportsOverlap: true,
        presets: [
            { name: 'Pedestrian Zone', tags: { highway: 'pedestrian' } },
        ],
        copy: {
            filterLabel: 'Zone types that may merge',
            filterHelp: 'Only ticked zone types are compared. Others are kept unchanged.',
            overlapPlaceholder: '70 (default)',
            overlapHelp: "Share of the base zone's area the two must share. Leave blank for 70%.",
        },
    },
};

export const UNION_ENTITY_TYPES = Object.keys(UNION_ENTITY_CONFIG);
