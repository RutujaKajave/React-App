import React, { useState } from "react";
import { getCourseTerm, terms } from "../utilities/time";
import {
  signInWithGoogle,
  firebaseSignOut,
  useUserState,
} from "../utilities/firebase";
import Course from "./Course";

const TermButton = ({ term, setTerm, checked }) => (
  <>
    <input
      type="radio"
      id={term}
      className="btn-check"
      autoComplete="off"
      onChange={() => setTerm(term)}
      checked={checked}
    />
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const SignInButton = () => (
  <button
    className="btn btn-secondary btn-sm"
    onClick={() => signInWithGoogle()}
  >
    Sign In
  </button>
);

const SignOutButton = () => (
  <button
    className="btn btn-secondary btn-sm"
    onClick={() => firebaseSignOut()}
  >
    Sign Out
  </button>
);

const TermSelector = ({ term, setTerm }) => {
  const [user] = useUserState();

  return (
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
        {Object.values(terms).map((value) => (
          <TermButton
            key={value}
            term={value}
            checked={value === term}
            setTerm={setTerm}
          />
        ))}
      </div>

      {user ? <SignOutButton /> : <SignInButton />}
    </div>
  );
};

const scheduleChanged = (selected, courses) =>
  selected.some((course) => course !== courses[course.id]);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState("Fall");
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(
    (course) => term === getCourseTerm(course)
  );

  if (scheduleChanged(selected, courses)) setSelected([]);

  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map((course) => (
          <Course
            key={course.id}
            course={course}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </>
  );
};

export default CourseList;
