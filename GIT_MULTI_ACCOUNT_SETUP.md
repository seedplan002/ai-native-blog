# Git 멀티 계정 설정 가이드

GitHub 계정을 여러 개 사용할 때, 리포지토리별로 계정을 분리하는 설정 방법.

---

## 전제 조건

- Git Credential Manager가 설치되어 있어야 한다 (Git for Windows 기본 포함).
- 전역 `user.name` / `user.email`은 설정하지 않는다 (실수 방지).

```bash
# 전역 설정 확인
git config --global --list

# 만약 설정되어 있다면 제거
git config --global --unset user.name
git config --global --unset user.email
```

---

## 새 리포지토리 설정 순서

### 1. GitHub에서 리포지토리 생성

GitHub 웹에서 원하는 계정으로 리포지토리를 만든다.

### 2. 로컬에 clone 또는 init

```bash
git clone https://github.com/{계정명}/{리포지토리명}.git
cd {리포지토리명}
```

### 3. 로컬 git user 설정 (커밋 author)

```bash
git config user.name "{계정명}"
git config user.email "{계정 이메일}"
```

- `.git/config`에 저장된다.
- 이 리포지토리에서의 모든 커밋에 이 이름/이메일이 기록된다.
- Credential Manager와는 무관하다. 순수하게 커밋 메시지에 남는 author 정보일 뿐이다.

### 4. remote URL에 사용자명 포함 (push/pull 인증 분리)

```bash
git remote set-url origin https://{계정명}@github.com/{계정명}/{리포지토리명}.git
```

- URL에 사용자명을 포함하면 Git Credential Manager가 계정별로 credential을 분리 저장한다.
- 사용자명이 없으면 `github.com` 하나의 credential만 사용하므로 계정이 섞인다.

### 5. 첫 git push (Credential Manager 등록)

```bash
git push origin main
```

- 이 시점에 브라우저 인증 창이 뜬다.
- URL에 포함된 사용자명에 해당하는 GitHub 계정으로 로그인한다.
- 인증 성공 시 Git Credential Manager가 토큰을 저장한다.
- 이후 같은 리포지토리에서의 push/pull은 자동 인증된다.

### 6. gh CLI 로그인 (PR 등 GitHub API 작업이 필요할 때)

```bash
# 로그인 (브라우저 인증)
gh auth login
# → GitHub.com 선택
# → HTTPS 선택
# → 브라우저로 해당 계정 로그인

# PR 생성
gh pr create --title "feat: ..." --body "..."
```

- gh CLI는 Git Credential Manager와 별개의 인증 체계이다.
- 여러 계정을 등록해두고 전환할 수 있다.

```bash
# 계정 추가 등록
gh auth login    # 다른 계정으로 로그인

# 등록된 계정 확인
gh auth status

# 계정 전환
gh auth switch -u {계정명}
```

---

## 인증 체계 요약

```
git commit
  └─ .git/config의 user.name / user.email
     (커밋 author 기록용, 인증과 무관)

git push / pull
  └─ remote URL의 사용자명
     └─ Git Credential Manager
        (계정별 토큰 저장, 첫 push 시 브라우저 인증으로 등록)

gh pr create / gh issue 등
  └─ gh auth login으로 등록한 활성 계정
     (git과 별개, gh auth switch로 전환)
```

---

## 설정 예시: 계정 2개 운용

```bash
# --- seedplan002 리포지토리 ---
cd ai-native-blog
git config user.name "seedplan002"
git config user.email "seedplan002@example.com"
git remote set-url origin https://seedplan002@github.com/seedplan002/ai-native-blog.git
git push -u origin main          # → 브라우저에서 seedplan002로 인증

# --- jwchoi42 리포지토리 ---
cd other-repo
git config user.name "jwchoi42"
git config user.email "jwchoi42@naver.com"
git remote set-url origin https://jwchoi42@github.com/jwchoi42/other-repo.git
git push -u origin main          # → 브라우저에서 jwchoi42로 인증

# --- gh CLI ---
gh auth login                    # seedplan002 로그인
gh auth login                    # jwchoi42 추가 로그인
gh auth switch -u seedplan002    # PR 만들 때 계정 전환
```

---

## Credential 관리

```bash
# 저장된 credential 확인
printf "protocol=https\nhost=github.com\nusername={계정명}\n" | git credential-manager get

# 특정 계정의 credential 삭제
printf "protocol=https\nhost=github.com\nusername={계정명}\n" | git credential-manager erase

# 전체 GitHub credential 삭제
printf "protocol=https\nhost=github.com\n" | git credential-manager erase
```
