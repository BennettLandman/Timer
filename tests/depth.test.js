import {test} from 'node:test';
import assert from 'node:assert/strict';
import {project} from '../src/depth.js';
test('blocks grow in perspective as they emerge from a socket toward the viewer',()=>{const widthAt=z=>project(267,85,z,235).x-project(202,85,z,235).x;assert.ok(widthAt(110)>widthAt(0));assert.ok(widthAt(0)>widthAt(-68));});
test('extrusion exposes both horizontal and vertical displacement, rather than a flat scale',()=>{const front=project(202,85,0,235),back=project(202,85,-58,235);assert.ok(Math.abs(front.x-back.x)>2);assert.ok(Math.abs(front.y-back.y)>2);});
