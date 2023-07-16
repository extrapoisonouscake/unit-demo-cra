# Инструкция

*Привет! Если тебе нужен доступ к репозиторию или есть вопросы, пиши мне в TG [@extrapoisonouscake](https://t.me/extrapoisonouscake)*

### В репозитории, в папке .github/workflows находятся два скрипта автоматизаций: скрипт для pull-request-а и скрипт для релиза по тэгу.

### Начало
Клонируй репозиторий и установи зависимости:
```bash
git clone https://github.com/extrapoisonouscake/unit-demo-cra
cd unit-demo-cra
npm ci
npx husky install
```


## 1. Тестирование валидации коммитов
Создай новую ветку и сделай любое незначительное изменение:
```bash
git checkout -b test
touch test.txt
```

Добавь новые файлы в коммит:
```bash
git add .
```

Попробуй дать коммиту неправильное название, например:
```bash
git commit -m 'fix bugs'
```
Ожидаемо появится ошибка и коммит создан не будет.

Теперь дай коммиту верное название, например:
```bash
git commit -m 'fix: bugs'
```
Ожидаемо ошибки не будет и коммит будет создан.


## 2. Тестирование автоматизации при пул-реквесте

После 1-го этапа загрузи изменения на сервер:
```bash
git push
```

Создай PR на этой странице: https://github.com/extrapoisonouscake/tes/pull/new/{ИМЯ_ВЕТКИ_ИЗ_ЭТАПА_1}

На странице Actions должна запуститься проверка "Test a new pull request by @{ТВОЙ_НИКНЕЙМ}". Вы можете нажать на нее.
В ней будет только одна job "🧪 Perform the pull request's testing". Она отвечает за тестирование PR на валидность и генерацию артефактов. Кроме того, она добавляет комментарий со ссылкой на результаты этой job.
При успешном завершении job на странице нашего PR отобразится сообщение о том, что все проверки прошли и merge возможен. Кроме того, там будет находиться комментарий со ссылкой на результаты job.


## 3. Тестирование автоматизации релиза

Теперь вернись в командную строку.

Вернись на главную ветку:
```bash
git checkout master
```

После этого тебе понадобится создать начальный тэг.
Пропиши команду `git tag -l`, чтобы получить список существующих тэгов. Если тэгов нет вообще, пропиши `git tag v1.0.0`, чтобы создать хотя бы один.

Далее тебе следует создать несколько коммитов. Их количество и содержание не важны, а нужны только для тестирования автоматизации:
```bash
git commit -m 'feat: add button' --allow-empty
git commit -m 'fix: edit button' --allow-empty
git commit -m 'doc: add doc how to use button' --allow-empty
git commit -m 'style: button' --allow-empty
```
*(`--allow-empty` разрешает создание коммитов без изменений)*

Создай релизный тэг, он должен быть больше последнего тэга из списка от команды выше. Например:
```bash
git tag v2.0.0
```

Отправь тэг на сервер:
```bash
git push origin v2.0.0
```

Перейди на страницу Actions в репозитории. На ней должна появиться проверка "Process a newly sent {ТВОЙ_ТЭГ} release".
Ты можешь нажать на нее и увидеть три последовательные job.

- "🛠️ Setup and test the release" отвечает за тестирование релиза, генерацию артефактов и добавление ветки "release-{ТВОЙ_ТЭГ}"
- "📝 Generate the record" отвечает за создание записи о релизе в Issues
- "📤 Deploy to Github Pages" отвечает за деплой на Github Pages и добавление отметки об этом в соответствующей записи в Issues
- "🏁 Finish the release" отвечает за закрытие записи релиза.

После успешного завершения проверки на странице Issues в разделе закрытых записей будет находиться запись "Release {ТВОЙ_ТЭГ}".
В ней будет changelog, обхватывающий все коммиты, с предпоследнего тэга до последнего, и сортирующим все коммиты по категориям. Для каждого коммита отображается его текст и ссылка на этот коммит на GitHub

Также, в записи будут находиться:
- ссылка на результат проверки
- ссылка на опубликованное приложение на Github Pages
- сообщение об успешном завершении проверки и закрытии записи


## 4. Тестирование изменения существующих релизов
Чтобы удостовериться, что при изменении существующих релизов в Issues не создается новая запись, а изменяется старая, тебе следует зайти на предыдущую проверку релиза, которую ты запустил на предыдущем этапе. Нажми кнопку перезапуска и выбери опцию перезапуска всех работ.
Таким образом, ты сымытировал ситуацию изменения существующего релиза, а, следовательно, и повторного выполнения проверки.

Когда проверка завершится, посети страницу Issues, найди запись с названием "Release {ТВОЙ_ТЭГ}". В записи появятся новый changelog и остальные данные, описанные на предыдущем этапе.


### Примечание 1
Оба скрипта проверок используют локальную action, которая находится в ./github/actions/run-tests/action.yml
Она нужна для запуска всех тестов. Но в обоих проверках выполняется один и тот же алгоритм тестирований. Чтобы не переписывать один и тот же код в двух проверках, я решил вынести его в отдельный файл.

### Примечание 2
В двух проверках используется actions/cache для кэширования NPM-зависимостей и последующего ускорения процесса проверок.