import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function BuildBusinessPage() {
  const { t } = useTranslation();
  const k = "helpArticles.buildBusiness";

  return (
    <HelpArticleLayout>
      <h1>{t(`${k}.title`)}</h1>

      <h2>{t(`${k}.whyTitle`)}</h2>
      <p>{t(`${k}.why1`)}</p>
      <p>{t(`${k}.why2`)}</p>

      <h2>{t(`${k}.mainTitle`)}</h2>
      <h3>{t(`${k}.nameTitle`)}</h3>
      <p>{t(`${k}.nameBody`)}</p>
      <p>
        <strong>{t(`${k}.bestPractices`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.nameTip1`)}</li>
        <li>{t(`${k}.nameTip2`)}</li>
      </ul>
      <p>
        <strong>{t(`${k}.examples`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.nameEx1`)}</li>
        <li>{t(`${k}.nameEx2`)}</li>
      </ul>

      <h3>{t(`${k}.descTitle`)}</h3>
      <p>{t(`${k}.descBody`)}</p>
      <p>
        <strong>{t(`${k}.include`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.include1`)}</li>
        <li>{t(`${k}.include2`)}</li>
        <li>{t(`${k}.include3`)}</li>
        <li>{t(`${k}.include4`)}</li>
      </ul>

      <h3>{t(`${k}.contactTitle`)}</h3>
      <p>{t(`${k}.contactBody`)}</p>
      <h3>{t(`${k}.categoryTitle`)}</h3>
      <p>{t(`${k}.categoryBody`)}</p>
      <h3>{t(`${k}.areaTitle`)}</h3>
      <p>{t(`${k}.areaBody`)}</p>

      <h2>{t(`${k}.galleryTitle`)}</h2>
      <p>{t(`${k}.galleryBody`)}</p>
      <p>
        <strong>{t(`${k}.recommended`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.rec1`)}</li>
        <li>{t(`${k}.rec2`)}</li>
        <li>{t(`${k}.rec3`)}</li>
      </ul>
      <p>
        <strong>{t(`${k}.bestPractices`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.galleryTip1`)}</li>
        <li>{t(`${k}.galleryTip2`)}</li>
        <li>{t(`${k}.galleryTip3`)}</li>
      </ul>

      <h2>{t(`${k}.reviewsTitle`)}</h2>
      <p>{t(`${k}.reviewsBody`)}</p>
      <p>
        <strong>{t(`${k}.reviewsWhy`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.reviewsWhy1`)}</li>
        <li>{t(`${k}.reviewsWhy2`)}</li>
        <li>{t(`${k}.reviewsWhy3`)}</li>
      </ul>
      <p>
        <strong>{t(`${k}.askReviews`)}</strong>
      </p>
      <p>{t(`${k}.askReviewsBody`)}</p>

      <h2>{t(`${k}.calendarTitle`)}</h2>
      <p>{t(`${k}.calendarBody`)}</p>
      <p>
        <strong>{t(`${k}.serviceGuide`)}</strong>
      </p>
      <ul>
        <li>{t(`${k}.service1`)}</li>
        <li>{t(`${k}.service2`)}</li>
        <li>{t(`${k}.service3`)}</li>
        <li>{t(`${k}.service4`)}</li>
      </ul>

      <h2>{t(`${k}.faqTitle`)}</h2>
      <p>{t(`${k}.faqBody`)}</p>
      <table>
        <thead>
          <tr>
            <th>{t(`${k}.qCol`)}</th>
            <th>{t(`${k}.aCol`)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t(`${k}.q1`)}</td>
            <td>{t(`${k}.a1`)}</td>
          </tr>
          <tr>
            <td>{t(`${k}.q2`)}</td>
            <td>{t(`${k}.a2`)}</td>
          </tr>
          <tr>
            <td>{t(`${k}.q3`)}</td>
            <td>{t(`${k}.a3`)}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t(`${k}.saveTitle`)}</h2>
      <p>{t(`${k}.save1`)}</p>
      <p>{t(`${k}.save2`)}</p>

      <h2>{t(`${k}.checklistTitle`)}</h2>
      <ul>
        <li>{t(`${k}.check1`)}</li>
        <li>{t(`${k}.check2`)}</li>
        <li>{t(`${k}.check3`)}</li>
        <li>{t(`${k}.check4`)}</li>
        <li>{t(`${k}.check5`)}</li>
        <li>{t(`${k}.check6`)}</li>
      </ul>
    </HelpArticleLayout>
  );
}
