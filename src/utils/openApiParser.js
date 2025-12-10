import yaml from 'js-yaml';

/**
 * OpenAPI 스펙을 파싱하여 구조화된 데이터로 변환
 */
export function parseOpenApiSpec(specText) {
  try {
    let spec;
    
    // JSON 또는 YAML 파싱 시도
    try {
      spec = JSON.parse(specText);
    } catch (e) {
      spec = yaml.load(specText);
    }

    if (!spec || !spec.paths) {
      throw new Error('유효한 OpenAPI 스펙이 아닙니다. paths 필드가 필요합니다.');
    }

    const endpoints = [];
    const securitySchemes = spec.components?.securitySchemes || {};
    const security = spec.security || [];

    // 모든 엔드포인트 추출
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]) => {
        if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method.toLowerCase())) {
          const endpoint = {
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId || `${method}_${path.replace(/\//g, '_')}`,
            summary: operation.summary || '',
            description: operation.description || '',
            parameters: operation.parameters || [],
            requestBody: operation.requestBody,
            responses: operation.responses || {},
            security: operation.security || security,
            tags: operation.tags || [],
          };

          endpoints.push(endpoint);
        }
      });
    });

    return {
      info: spec.info || {},
      servers: spec.servers || [],
      endpoints,
      securitySchemes,
      components: spec.components || {},
    };
  } catch (error) {
    throw new Error(`OpenAPI 파싱 실패: ${error.message}`);
  }
}

/**
 * 엔드포인트에서 ID 파라미터 추출
 */
export function extractIdParameters(endpoint) {
  const idParams = [];
  
  // 경로 파라미터에서 ID 추출
  endpoint.parameters?.forEach(param => {
    if (param.in === 'path' && (param.name.toLowerCase().includes('id') || 
        param.name.toLowerCase().includes('user') ||
        param.name.toLowerCase().includes('resource'))) {
      idParams.push(param);
    }
  });

  // 경로 자체에서 {id} 패턴 추출
  const pathIdMatches = endpoint.path.match(/\{(\w*id\w*)\}/gi);
  if (pathIdMatches) {
    pathIdMatches.forEach(match => {
      const paramName = match.replace(/[{}]/g, '');
      if (!idParams.find(p => p.name === paramName)) {
        idParams.push({
          name: paramName,
          in: 'path',
          required: true,
        });
      }
    });
  }

  return idParams;
}

/**
 * 인증 방식 확인
 */
export function hasAuthentication(endpoint, securitySchemes) {
  if (!endpoint.security || endpoint.security.length === 0) {
    return false;
  }

  return endpoint.security.some(sec => {
    return Object.keys(sec).length > 0;
  });
}

