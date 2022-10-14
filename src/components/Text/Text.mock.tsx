import React from 'react';
import Context from '../Text/context';

const parse = content => content.trim().split(/\r?\n/).reduce((prev, cur, index) => {
    const [dictionaryKey, translatedValue] = cur.trim().split('=');
    dictionaryKey && translatedValue && prev.push({dictionaryKey, translatedValue});
    return prev;
}, []);

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

export const middleware = _store => next => action => {
    if (action.method === 'core.translation.fetch') {
        return {
            result: {
                translations: translations[action.params.languageId]
            }
        };
    } else return next(action);
};

const translate = globalLanguage => (id, text, language) => dictionary?.[language || globalLanguage || 'en']?.[id || text] || text;

export const Translate = ({language, children}) => {
    return <Context.Provider
        value={{
            translate: translate(language)
        }}
    >{children}</Context.Provider>;
};
