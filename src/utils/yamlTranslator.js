import yaml from 'js-yaml';

/**
 * YAML 스펙의 번역 가능한 필드들을 번역
 */
export function translateYamlSpec(yamlText, language) {
  if (language === 'ko') {
    return yamlText; // 한국어는 원본 그대로
  }

  try {
    // YAML 파싱
    const spec = yaml.load(yamlText);
    
    if (!spec) {
      return yamlText;
    }

    // 번역 맵 (간단한 번역)
    const translations = getTranslationMap(language);

    // 재귀적으로 객체를 순회하며 번역 가능한 문자열 필드 번역
    const translatedSpec = translateObject(spec, translations);

    // YAML로 다시 변환
    return yaml.dump(translatedSpec, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
    });
  } catch (error) {
    console.error('YAML 번역 실패:', error);
    return yamlText; // 실패 시 원본 반환
  }
}

/**
 * 번역 맵 생성
 */
function getTranslationMap(language) {
  const maps = {
    en: {
      // 기본 필드
      '기본 REST API': 'Basic REST API',
      '기본적인 REST API 구조를 가진 예시': 'Example with basic REST API structure',
      '프로덕션 서버': 'Production Server',
      '제품 목록 조회': 'Get Product List',
      '제품 생성': 'Create Product',
      '제품 상세 조회': 'Get Product Details',
      '제품 수정': 'Update Product',
      '제품 삭제': 'Delete Product',
      '성공': 'Success',
      '생성됨': 'Created',
      '삭제됨': 'Deleted',
      
      // 취약한 사용자 관리 API
      '취약한 사용자 관리 API': 'Vulnerable User Management API',
      'OWASP Top 10 취약점이 다수 포함된 예시': 'Example with multiple OWASP Top 10 vulnerabilities',
      '사용자 목록 조회': 'Get User List',
      '사용자 생성': 'Create User',
      '사용자 정보 조회': 'Get User Info',
      '사용자 수정': 'Update User',
      '사용자 삭제': 'Delete User',
      '인증 실패': 'Authentication Failed',
      '권한 없음': 'Forbidden',
      
      // 인증 없는 API
      '인증 없는 API': 'API without Authentication',
      '인증 메커니즘이 전혀 없는 취약한 API': 'Vulnerable API with no authentication mechanism',
      
      // 외부 API 통합 서비스
      '외부 API 통합 서비스': 'External API Integration Service',
      '외부 API를 호출하는 서비스 예시': 'Example service that calls external APIs',
      '외부 API 호출': 'Call External API',
      '프록시 요청': 'Proxy Request',
      '웹훅 수신': 'Receive Webhook',
      '서드파티 데이터 조회': 'Get Third Party Data',
      '외부 서비스로 파일 업로드': 'Upload File to External Service',
      
      // 마이크로서비스 API
      '마이크로서비스 API': 'Microservices API',
      '여러 마이크로서비스로 구성된 API 예시': 'Example API composed of multiple microservices',
      'API Gateway': 'API Gateway',
      '주문 목록 조회': 'Get Order List',
      '주문 생성': 'Create Order',
      '결제 처리': 'Process Payment',
      '재고 조회': 'Get Inventory',
      '알림 전송': 'Send Notification',
      
      // 보안이 강화된 API
      '보안이 강화된 API': 'Hardened Security API',
      '보안 모범 사례를 따르는 잘 보호된 API 예시': 'Well-protected API example following security best practices',
      '프로덕션 서버 (HTTPS)': 'Production Server (HTTPS)',
      '사용자 정보 조회': 'Get User Info',
      '사용자 정보 조회 (BOLA 취약)': 'Get User Info (BOLA Vulnerable)',
      '모든 사용자 조회': 'Get All Users',
      '모든 사용자 조회 (관리자 전용)': 'Get All Users (Admin Only)',
      '모든 사용자 조회 (권한 체크 없음)': 'Get All Users (No Permission Check)',
      '관리자 권한 필요': 'Admin Permission Required',
      '로그인': 'Login',
      '로그인 (취약한 인증)': 'Login (Vulnerable Authentication)',
      '결제 처리': 'Process Payment',
      '결제 처리 (Rate Limit 없음)': 'Process Payment (No Rate Limit)',
      '프록시 요청 (SSRF 취약)': 'Proxy Request (SSRF Vulnerable)',
      '관리자 설정 조회': 'Get Admin Config',
      '관리자 설정 수정': 'Update Admin Config',
      'OWASP Top 10 취약점이 다수 포함된 예시 API': 'Example API with multiple OWASP Top 10 vulnerabilities',
    },
    ja: {
      // 기본 필드
      '기본 REST API': '基本REST API',
      '기본적인 REST API 구조를 가진 예시': '基本的なREST API構造を持つ例',
      '프로덕션 서버': '本番サーバー',
      '제품 목록 조회': '製品一覧取得',
      '제품 생성': '製品作成',
      '제품 상세 조회': '製品詳細取得',
      '제품 수정': '製品更新',
      '제품 삭제': '製品削除',
      '성공': '成功',
      '생성됨': '作成済み',
      '삭제됨': '削除済み',
      
      // 취약한 사용자 관리 API
      '취약한 사용자 관리 API': '脆弱なユーザー管理API',
      'OWASP Top 10 취약점이 다수 포함된 예시': 'OWASP Top 10の脆弱性が多数含まれた例',
      '사용자 목록 조회': 'ユーザー一覧取得',
      '사용자 생성': 'ユーザー作成',
      '사용자 정보 조회': 'ユーザー情報取得',
      '사용자 수정': 'ユーザー更新',
      '사용자 삭제': 'ユーザー削除',
      '인증 실패': '認証失敗',
      '권한 없음': '権限なし',
      
      // 인증 없는 API
      '인증 없는 API': '認証なしAPI',
      '인증 메커니즘이 전혀 없는 취약한 API': '認証メカニズムが全くない脆弱なAPI',
      
      // 외부 API 통합 서비스
      '외부 API 통합 서비스': '外部API統合サービス',
      '외부 API를 호출하는 서비스 예시': '外部APIを呼び出すサービスの例',
      '외부 API 호출': '外部API呼び出し',
      '프록시 요청': 'プロキシリクエスト',
      '웹훅 수신': 'Webhook受信',
      '서드파티 데이터 조회': 'サードパーティデータ取得',
      '외부 서비스로 파일 업로드': '外部サービスへのファイルアップロード',
      
      // 마이크로서비스 API
      '마이크로서비스 API': 'マイクロサービスAPI',
      '여러 마이크로서비스로 구성된 API 예시': '複数のマイクロサービスで構成されたAPIの例',
      'API Gateway': 'API Gateway',
      '주문 목록 조회': '注文一覧取得',
      '주문 생성': '注文作成',
      '결제 처리': '決済処理',
      '재고 조회': '在庫取得',
      '알림 전송': '通知送信',
      
      // 보안이 강화된 API
      '보안이 강화된 API': 'セキュリティ強化API',
      '보안 모범 사례를 따르는 잘 보호된 API 예시': 'セキュリティのベストプラクティスに従う適切に保護されたAPIの例',
      '프로덕션 서버 (HTTPS)': '本番サーバー (HTTPS)',
      '사용자 정보 조회': 'ユーザー情報取得',
      '사용자 정보 조회 (BOLA 취약)': 'ユーザー情報取得 (BOLA脆弱)',
      '모든 사용자 조회': '全ユーザー取得',
      '모든 사용자 조회 (관리자 전용)': '全ユーザー取得 (管理者専用)',
      '모든 사용자 조회 (권한 체크 없음)': '全ユーザー取得 (権限チェックなし)',
      '관리자 권한 필요': '管理者権限が必要',
      '로그인': 'ログイン',
      '로그인 (취약한 인증)': 'ログイン (脆弱な認証)',
      '결제 처리': '決済処理',
      '결제 처리 (Rate Limit 없음)': '決済処理 (レート制限なし)',
      '프록시 요청 (SSRF 취약)': 'プロキシリクエスト (SSRF脆弱)',
      '관리자 설정 조회': '管理者設定取得',
      '관리자 설정 수정': '管理者設定更新',
      'OWASP Top 10 취약점이 다수 포함된 예시 API': 'OWASP Top 10の脆弱性が多数含まれた例API',
    },
  };

  return maps[language] || {};
}

/**
 * 객체를 재귀적으로 순회하며 번역 가능한 문자열 필드 번역
 */
function translateObject(obj, translations) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // 번역 맵에 있는 경우 번역
    return translations[obj] || obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, translations));
  }

  if (typeof obj === 'object') {
    const translated = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = translateObject(value, translations);
    }
    return translated;
  }

  return obj;
}

