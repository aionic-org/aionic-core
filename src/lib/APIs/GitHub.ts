import { bind } from 'decko'

/**
 * Communication between Aionic and GitHub developer API
 *
 * https://developer.github.com/
 */

export class GitHubApi {
  private url: string = 'https://api.github.com'

  /**
   * Get repositories from an organization
   *
   * @param {string} organization
   * @returns {Promise<Array<object>>}
   */
  @bind
  public async getOrganizationRepos(organization: string): Promise<object[]> {
    return new Array()
  }

  /**
   * Get commits from an branch
   *
   * @param {string} branch
   * @returns {Promise<Array<object>>}
   */
  @bind
  public async getBranchCommits(branch: string): Promise<object[]> {
    return new Array()
  }
}
