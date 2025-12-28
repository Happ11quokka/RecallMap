#!/bin/bash

# RecallMap Backend 실행 스크립트

echo "RecallMap Backend 시작..."

# 가상환경 활성화 확인
if [ ! -d "venv" ]; then
    echo "가상환경이 없습니다. 먼저 'python -m venv venv'를 실행하세요."
    exit 1
fi

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo ".env 파일이 없습니다. .env.example을 복사하여 .env를 만들고 API 키를 입력하세요."
    exit 1
fi

# 서버 실행
echo "서버를 시작합니다..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
