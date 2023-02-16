import React from 'react';
import merge from 'ut-function.merge';
import Context from '../Text/context';
import { fnMap, defaultFormatOptions } from '../Gate/formatValue';

const parse = content => content.trim().split(/\r?\n/).reduce((prev, cur, index) => {
    const [dictionaryKey, translatedValue] = cur.trim().split('=');
    dictionaryKey && translatedValue && prev.push({dictionaryKey, translatedValue});
    return prev;
}, []);

const configuration = {
    'portal.utPrime.GMap': {
        key: process.env.STORYBOOK_GMAP_KEY || '', // eslint-disable-line no-process-env
        region: 'BG'
    }
};

const currencies = [
    {currencyId: 1, code: 'EUR', scale: 2},
    {currencyId: 2, code: 'USD', scale: 2},
    {currencyId: 3, code: 'BGN', scale: 2},
    {currencyId: 4, code: 'IQD', scale: 3}
];

/* spell-checker: disable */
const translations = {
    bg: parse(`
        Dashboard=Табло
        test app=тест приложение
        Main=Главно
        Page 1=Страница 1
        Page 2=Страница 2
        Page 3=Страница 3
        page 1 component=страница 1 компонент
        page 2 component=страница 2 компонент
        page 3 component=страница 3 компонент
        Granted=Достъпно
        access granted=осигурен достъп
        dashboard content=табло съдържание
        Help=Помощ
        Profile=Профил
        Logout=Изход

        Reproduction=Размножаване
        Tree=Дърво
        Name=Име
        Description=Описание
        Type=Тип
        Taxonomy=Таксономия
        Seed=Семе
        Flower=Цвят
        Fruit=Плод
        Links=Връзки
        Title=Заглавие
        No results found=Няма резултати
        Morphology=Морфология
        Url=Връзка
        Add=Добавяне
        Delete=Изтриване

        Input=Поле
        Password=Парола
        Text=Текст
        Mask=Маска
        Chips=Чипове
        Autocomplete=Подсказка
        File=Файл
        Ocr=Разпознаване на текст
        Boolean=Флаг
        Date=Дата
        Time=Час
        Datetime=Дата и час
        Number=Число
        Currency=Валута
        Integer=Цяло число

        Image=Изображение
        Dropdown=Списък
        Dropdown Tree=Списък дърво
        Multi Select=Мулти избор
        Multi Select Tree=Мулти избор дърво
        Select=Избор
        Table=Таблица
        Value=Стойност

        Select Table=Избор таблица
        Multi Select Panel=Мулти избор панел
        Multi Select Tree Table=Мулти избор таблица дърво
        Select Table With Flags=Избор таблица с флаг
        Flag1=Флаг1
        Flag2=Флаг2
        Radio=Радио

        Edit=Редактирай
        Create=Създай
        View=Преглед
        Size=Размер
        Do you confirm the deletion of the selected rows ?=Потвърждавате ли изтриването ?
        Review=Преглед
        Reject=Откажи
        Approve=Приеми
        Granded=Осигурен достъп

        Monday=Понеделник
        Tuesday=Вторник
        Wednesday=Сряда
        Thursday=Четвъртък
        Friday=Петък
        Saturday=Събота
        Sunday=Неделя
        Weekday Name=Ден от седмицата
        Start Time=Начален час
        End Time=Краен час
        Entity Name=Обект

        Current=Текущ
        Previous=Предишен
        Diff=Разлики
        General Info=Обща информация
        First name=Собствено име
        Last name=Фамилия
        National id=ЕГН
        Gender=Пол
        User Classification=Класификация
        Phone model=Модел телефон
        Computer model=Модел компютър
        Business Unit=Организация
        Business Unit Type=Тип организация
        Lock Status=Статус заключване
        Addresses=Адреси
        Phone Numbers=Телефони
        Assigned Roles=Роли
        Credentials=Пароли
        Set Username=Потребителско име
        Access Policy Status=Статус достъп
        Override User Access Policy=Политика за достъп
        External Credentials=Външни пароли
        External System=Външна система
        User Type=Тип потребител
        Username=Потребителско име
        Documents=Документи
    `),
    ar: parse(`
        Dashboard=لوحة القيادة
        test app=تطبيق الاختبار
        Main=رئيسي
        Page 1=صفحة 1
        Page 2=الصفحة 2
        Page 3=الصفحة 3
        page 1 component=الصفحة 1 المكون
        page 2 component=الصفحة 2 مكون
        page 3 component=الصفحة 3 مكون
        Granted=ممنوح
        access granted=لقد تم منح الوصول
        dashboard content=محتوى لوحة القيادة
        Help=مساعدة
        Profile=ملف تعريفي للمستخدم
        Logout=تسجيل خروج

        Reproduction=تكاثر
        Tree=شجرة
        Name=اسم
        Description=وصف
        Type=يكتب
        Taxonomy=التصنيف
        Seed=بذرة
        Flower=ورد
        Fruit=فاكهة
        Links=الروابط
        Title=عنوان
        No results found=لم يتم العثور على نتائج
        Morphology=علم التشكل المورفولوجيا
        Url=رابط موقع
        Add=يضيف
        Delete=حذف

        Input=إدخال
        Password=كلمة المرور
        Text=نص
        Mask=قناع
        Chips=رقائق
        Autocomplete=الإكمال التلقائي
        File=ملف
        Ocr=أوكر
        Boolean=قيمة منطقية
        Date=تاريخ
        Time=زمن
        Datetime=التاريخ و الوقت
        Number=رقم
        Currency=عملة
        Integer=عدد صحيح

        Image=صورة
        Dropdown=اسقاط
        Dropdown Tree=شجرة منسدلة
        Multi Select=تحديد متعدد
        Multi Select Tree=متعدد التحديد شجرة
        Select=يختار
        Table=الطاولة
        Value=قيمة

        Select Table=حدد الجدول
        Multi Select Panel=لوحة متعددة التحديد
        Multi Select Tree Table=جدول شجرة متعدد التحديد
        Select Table With Flags=حدد الجدول مع الأعلام
        Radio=مذياع

        Edit=يحرر
        Create=خلق
        Size=بحجم
        Navigation component=مكون التنقل

        Current=تيار
        Previous=سابق
        Diff=الفارق
        General Info=معلومات عامة
        First name=الاسم الاول
        Last name=اللقب
        National id=الهوية الوطنية
        Gender=جنس
        User Classification=تصنيف المستخدم
        Phone model=طراز الهاتف
        Computer model=طراز الكمبيوتر
        Business Unit=وحدة عمل
        Business Unit Type=نوع وحدة الأعمال
        Lock Status=حالة القفل
        Addresses=عناوين
        Phone Numbers=أرقام الهواتف
        Assigned Roles=الأدوار المعينة
        Credentials=أوراق اعتماد
        Set Username=تعيين اسم المستخدم
        Access Policy Status=الوصول إلى حالة السياسة
        Override User Access Policy=تجاوز نهج وصول المستخدم
        External Credentials=أوراق الاعتماد الخارجية
        External System=النظام الخارجي
        User Type=نوع المستخدم
        Username=اسم المستخدم
        Documents=وثائق
    `)
};
/* spell-checker: enable */

const dict = translations => translations?.reduce(
    (prev, {dictionaryKey, translatedValue}) => dictionaryKey === translatedValue ? prev : {...prev, [dictionaryKey]: translatedValue},
    {}
);

const dictionary = {
    bg: dict(translations.bg),
    ar: dict(translations.ar)
};

const joiMessages = {
    bg: {
        'any.required': '{{#label}} е задължително'
    }
};

export const middleware = _store => next => action => {
    if (action.method === 'core.portal.get') {
        return {
            result: {
                translations: translations[action.params.languageId],
                configuration,
                currencies
            }
        };
    } else return next(action);
};

const translate = globalLanguage => (id, text, language) => dictionary?.[language || globalLanguage || 'en']?.[id || text] || text;

export const Translate = ({language, children}) => {
    return <Context.Provider
        value={{
            joiMessages: joiMessages[language],
            translate: translate(language),
            getScale: what => currencies.find(currency => [currency.code, currency.currencyId].includes(what))?.scale,
            configuration,
            formatValue: (value, {type, ...opts}: any) => {
                const {fn, ...options} = merge({}, defaultFormatOptions[type], opts);
                return value && fnMap[fn]?.(value, options);
            }
        }}
    >{children}</Context.Provider>;
};
