defmodule AdventOfCode.Cli.Utils.SolutionHelper do
  @moduledoc """
  Utility module for running solution parts and runs
  """

  def get_path(year, task) do
    Path.join(["lib", "solutions", year, task])
  end

  def get_file_path(year, task) do
    Path.join(["lib", "solutions", year, task, "solution.ex"])
  end

  def get_module(year, task) do
    "AdventOfCode.Solutions#{year}.Task#{task}"
    |> String.split(".")
    |> Enum.map(&String.to_atom/1)
    |> Module.concat()
  end
end
